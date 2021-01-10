const express = require('express');
const router = express.Router();
const db = require('../../my_modules/mydb');

/*  */
router.get('/', function(req, res, next) 
{
    res.render('test/chat2', {});
});


const connects = new Set();
router.ws('/', (ws, req) => {
    connects.add(ws);
    console.log("new connection");

    db.query('select * from chat_messages where room_id=?', [1], (error, results) => 
    {
        if(error) throw error;

        const messages = results.map(v=>({user_id: v.user_id, number: v.number, message: v.message}));
        
        for(message of messages)
        {
            ws.send(JSON.stringify(message));
        }
    });
    
    ws.on('message', message => 
    {
        console.log('Received -', message);

        for(const socket of connects)
        {
            socket.send(message);
        };
    });
  
    ws.on('close', () => 
    {
        connects.delete(ws);
    });
});

module.exports = router;
