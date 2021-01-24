const express = require('express');
const router = express.Router();
const db = require('../../my_modules/mydb');
const make_hf_links = require('../../my_modules/test/hf_link');

/*  */
router.get('/:id', function(req, res, next) 
{
    const user_id = req.params.id;

    db.query('select * from chat_members where user_id=?', [user_id], (error, results) => 
    {
        if(error) throw error;

        db.query('select * from chat_rooms where id in(?)', [results.map(v => v.room_id)], (error, results) => 
        {
            console.log(results);

            if(results)
            {
                for(const room of results)
                {
                    room.href="http://localhost:3000/test/chat2/" + room.id + "/" + user_id;
                }
            }

            res.render('test/rooms', {footer_links: make_hf_links(user_id), rooms: results});
        });
    });
});

module.exports = router;
