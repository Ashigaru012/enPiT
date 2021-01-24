const express = require('express');
const router = express.Router();
const db = require('../../my_modules/mydb');
const make_hf_links = require("../../my_modules/test/hf_link");

/*  */
router.get('/:room_id/:user_id', function(req, res, next) 
{
    const room_id = req.params.room_id;
    const user_id = req.params.user_id;
    
    db.query('select * from chat_rooms where id=?', [room_id], (error, results) =>
    {
        if(error) throw error;

        const room_title = results[0].title;
        const host_id = results[0].host_id;

        db.query('select * from users where id=?', [user_id], (error, results) =>
        {
            if(error) throw error;

            const user = results[0];
        
            res.render('test/chat2', {footer_links: make_hf_links(user_id), room_title: room_title, room_id: room_id, user_id: user_id, host_id: host_id, user: user});
        });
    });
});


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

module.exports = router;
