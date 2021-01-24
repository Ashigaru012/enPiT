const express = require('express');
const router = express.Router();
const db = require('../../my_modules/mydb');
const make_hf_links = require('../../my_modules/test/hf_link');
const map3Router = require('./map3');
const map4Router = require('./map4');

/*  */
router.get('/:id', function(req, res, next) 
{
    const user_id = req.params.id;

    res.render('test/request', {footer_links: make_hf_links, user_id: user_id});
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

            db.query('insert into chat_rooms set ?', [{title: request.title, request_id: results.insertId, host_id: request.user_id, messages_num: 0}], (error, results) => 
            {
                if(error) throw error;

                const room_id = results.insertId;
                const user_id = request.user_id;

                request.room_id = room_id;

                db.query('insert into chat_members set ?', [{room_id: room_id, user_id: user_id}], (error, results) => 
                {
                    if(error) throw error;

                    console.log("new request.\n", request);
    
                    map3Router.notify_request(request);
                    map4Router.notify_request(request);

                    res.json({url: `http://localhost:3000/test/map4/${request.user_id}`});
                });
            });
        });
    });

});


module.exports = router;