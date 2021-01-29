const express = require('express');
const router = express.Router();
const config = require('config');
const tr = require('../my_modules/transaction');
const common = require("../my_modules/common");
const logger = require('../my_modules/mylog');
const indexRouter = require("./index");

router.get('/create', function(req, res, next) 
{
    try
    {
        const user_id = req.cookies.user_id;

        res.render("requests/create", {common: common, user_id: user_id});
    }
    catch(err)
    {
        logger.error(err);
    }
});


router.post("/", async (req, res) =>
{
    try
    {
        const request = req.body;
    
        logger.info("task request: ", request);
    
        await tr.do(async () =>
        {
            const user_id = request.user_id;
            const host = (await tr.query('select * from user', user_id))[0];

            request.lat = host.lat;
            request.lng = host.lng;

            const req_result = await tr.query('insert into request set ?', request);

            request.id = req_result.insertId;

            const results = await tr.query('insert into chat_room set ?', [{title: request.title, request_id: req_result.insertId, host_id: user_id, messages_num: 0}]);
            
            const room_id = request.room_id = results.insertId;
            
            await tr.query('insert into chat_member set ?', [{room_id: room_id, user_id: user_id}]);

            indexRouter.notify_request(request);
            
            res.json({url: `${config.host.protocol}://${config.host.ip_address}:${config.host.port}`});
        });
    }
    catch(err)
    {
        logger.error(err);
    }
});


module.exports = router;