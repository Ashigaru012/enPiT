const express = require('express');
const router = express.Router();
const db = require('../../my_modules/mydb');
const requestRouter = require('./map3');

/*  */
router.get('/:id', function(req, res, next) 
{
    const user_id = req.params.id;

    const footer_links = 
    {
        map_link: `http://localhost:3000/test/map3/${user_id}`,
        chat_link: `http://localhost:3000/test/rooms/${user_id}`,
        ranking_link: "#",
        mypage_link: "#"
    };

    res.render('test/request', {footer_links: footer_links, user_id: user_id});
});


router.post("/", (req, res) =>
{
    const request = req.body;

    console.log(request);

    db.query('select * from users', request.user_id, (error, results) => 
    {
        if(error) throw error;

        request.lat = results[0].lat;
        request.lng = results[0].lng;

        db.query('insert into requests_test2 set ?', request, (error, results) => 
        {
            if(error) throw error;

            request.id = results.insertId;

            db.query('insert into chat_rooms set ?', [{title: request.title, request_id: results.insertId, messages_num: 0}], (error, results) => 
            {
                if(error) throw error;

                const room_id = results.insertId;
                const user_id = request.user_id;

                request.room_id = room_id;

                db.query('insert into chat_members set ?', [{room_id: room_id, user_id: user_id}], (error, results) => 
                {
                    if(error) throw error;

                    console.log("new request.\n", request);
    
                    requestRouter.notify_request(request);

                    res.json({url: `http://localhost:3000/test/map3/${request.user_id}`});
                });
            });
        });
    });

});


module.exports = router;