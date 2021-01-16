const express = require('express');
const router = express.Router();
const db = require('../../my_modules/mydb');

/*  */
router.get('/:room_id/:user_id', function(req, res, next) 
{
    const room_id = req.params.room_id;
    const user_id = req.params.user_id;
    
    const footer_links = 
    {
        map_link: `http://localhost:3000/test/map3/${user_id}`,
        chat_link: `http://localhost:3000/test/rooms/${user_id}`,
        ranking_link: `http://localhost:3000/test/ranking/weekly/${user_id}`,
        mypage_link: "#"
    };

    res.render('test/chat2', {footer_links: footer_links, room_id: room_id, user_id: user_id});
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
        
                const messages = results.map(v=>({user_id: v.user_id, number: v.number, message: v.message}));
                
                for(message of messages)
                {
                    ws.send(JSON.stringify(message));
                }
            });
        }
        if(msg.key == "submit")
        {

            const message = 
            {
                room_id: msg.room_id,
                user_id: msg.user_id,
                number: msg.number,
                message: msg.message
            };
            db.query('insert into chat_messages set ?', [message], (error, results) => 
            {
                if(error) throw error;

                for(const socket of connects)
                {
                    socket.send(JSON.stringify(msg));
                };
            });

        }
    });
  
    ws.on('close', () => 
    {
        connects.delete(ws);
    });
});

module.exports = router;
