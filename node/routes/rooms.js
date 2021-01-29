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

        const user = (await tr.query('select * from users where id=?', [user_id]))[0];

        res.render('rooms/chat', {common: common, room_title: room.title, room_id: room.id, user_id: user.id, host_id: room.host_id, user: user});
    }
    catch(err)
    {
        logger.error(err);
    }
});


/*
router.post('/good', function(req, res, next) 
{
    const good = req.body;

    console.log(good);
    
    if(good.host_id == good.user_id)
    {
        db.query('select * from chat_members where room_id=? and user_id!=?', [good.room_id, good.host_id], (error, results) => 
        {
            if(error) throw error;

            const chat_member_ids = results.map(v => v.user_id);
            if(chat_member_ids.length)
            {
                db.query('update users set good=good+1 where id in(?)', [chat_member_ids], (error, results) => 
                {
                    if(error) throw error;

                    res.json(good);
                });
            }
        });
    }
    else
    {
        db.query('update users set good=good+1 where id=?', [good.host_id], (error, results) => 
        {
            if(error) throw error;

            res.json(good);
        });
    }
});


const connects = new Set();
router.ws('/', (ws, req) => {
    connects.add(ws);
    console.log("new connection");
    
    ws.on('message', json => 
    {
        console.log('Received -', json);

        const msg = JSON.parse(json);
        if(msg.key == "on_connected")
        {
            db.query('select * from chat_messages where room_id=?', [msg.room_id], (error, results) => 
            {
                if(error) throw error;
        
                for(message of results)
                {
                    ws.send(JSON.stringify(message));
                }
            });
        }
        else if(msg.key == "submit")
        {
            db.query('insert into chat_messages set ?', [msg], (error, results) => 
            {
                if(error) throw error;

                for(const socket of connects)
                {
                    socket.send(JSON.stringify(msg));
                };
            });
        }
        else if(msg.key == "request_location")
        {
            db.query('select * from users where id=?', [msg.user_id], (error, results) => 
            {
                if(error) throw error;

                const user = results[0];

                msg.message = `https://www.google.com/maps?q=${user.lat},${user.lng}`;
                
                db.query('insert into chat_messages set ?', [msg], (error, results) => 
                {
                    if(error) throw error;

                    for(const socket of connects)
                    {
                        socket.send(JSON.stringify(msg));
                    };
                });
                
            });
        }
    });
  
    ws.on('close', () => 
    {
        connects.delete(ws);
    });
});

*/

module.exports = router;
