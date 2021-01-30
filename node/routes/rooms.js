const express = require('express');
const router = express.Router();
const config = require('config');
const tr = require('../my_modules/transaction');
const common = require("../my_modules/common");
const logger = require('../my_modules/mylog');

/*  */
router.get('/', async function(req, res, next) 
{
    try
    {
        const user_id = req.cookies.user_id;

        const results = await tr.query('select * from chat_member where user_id=?', [user_id]);

        let rooms = [];
        if(results.length)
        {
            rooms = await tr.query('select * from chat_room where id in(?)', [results.map(v => v.room_id)]);

            for(const room of rooms)
            {
                room.href = `${config.host.protocol}://${config.host.ip_address}:${config.host.port}/rooms/${room.id}`;
            }
        }

        res.render('rooms', {common: common, rooms: rooms});
    }
    catch(err)
    {
        logger.error(err);
    }
});



/*  */
router.get('/:room_id', async function(req, res, next) 
{
    try
    {
        const room_id = req.params.room_id;
        const user_id = req.cookies.user_id;
        
        const room = (await tr.query('select * from chat_room where id=?', [room_id]))[0];

        const user = (await tr.query('select * from user where id=?', [user_id]))[0];

        res.render('rooms/chat', {common: common, room_title: room.title, room_id: room.id, user_id: user.id, host_id: room.host_id, user: user});
    }
    catch(err)
    {
        logger.error(err);
    }
});



router.post('/chat/good', async function(req, res, next) 
{
    try
    {
        const good = req.body;

        logger.info("good - ", good);
        
        if(good.host_id == good.user_id)
        {
            const results = await tr.query('select * from chat_member where room_id=? and user_id!=?', [good.room_id, good.host_id]);

            const member_ids = results.map(v => v.user_id);

            if(member_ids.length)
            {
                await tr.query('update user set good=good+1 where id in(?)', [member_ids]);
                
                res.json(good);
            }
        }
        else
        {
            await tr.query('update user set good=good+1 where id=?', [good.host_id]);
            
            res.json(good);
        }
    }
    catch(err)
    {
        logger.error(err);
    }
});

const connects = new Set();
router.ws('/chat-web-sock', (ws, req) => {
    connects.add(ws);

    logger.info("new connection - chat");
    
    ws.on('message', async json => 
    {
        try
        {
            logger.info('Received - chat: ', json);

            const msg = JSON.parse(json);
            if(msg.key == "on_connected")
            {
                const results = await tr.query('select * from chat_message where room_id=?', [msg.room_id]);

                for(const message of results)
                {
                    ws.send(JSON.stringify(message));
                }
            }
            else if(msg.key == "submit")
            {
                await tr.query('insert into chat_message set ?', [msg]);
                
                for(const socket of connects)
                {
                    socket.send(JSON.stringify(msg));
                };
            }
            else if(msg.key == "request_location")
            {
                const user = (await tr.query('select * from user where id=?', [msg.user_id]))[0];
                
                msg.message = `https://www.google.com/maps?q=${user.lat},${user.lng}`;
                
                await tr.query('insert into chat_message set ?', [msg]);

                for(const socket of connects)
                {
                    socket.send(JSON.stringify(msg));
                };
            }
        }
        catch(err)
        {
            logger.error(err);
        }
    });
  
    ws.on('close', () => 
    {
        try
        {
            connects.delete(ws);
        }
        catch(err)
        {
            logger.error(err);
        }
    });
});


module.exports = router;
