const express = require('express');
const router = express.Router();
const db = require('../../my_modules/mydb');

/*  */
router.get('/:id', function(req, res, next) 
{
    const user_id = req.params.id;
    
    const footer_links = 
    {
        map_link: `http://localhost:3000/test/map3/${user_id}`,
        chat_link: `http://localhost:3000/test/rooms/${user_id}`,
        ranking_link: `http://localhost:3000/test/ranking/weekly/${user_id}`,
        mypage_link: "#"
    };
    
    db.query('select * from chat_members where user_id=?', [user_id], (error, results) => 
    {
        if(error) throw error;

        db.query('select * from chat_rooms where id in(?)', [results.map(v => v.room_id)], (error, results) => 
        {
            console.log(results);

            for(const room of results)
            {
                room.href="http://localhost:3000/test/chat2/" + room.id + "/" + user_id;
            }

            res.render('test/rooms', {footer_links: footer_links, rooms: results});
        });
    });
});

module.exports = router;
