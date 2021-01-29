const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');
const tr = require('../my_modules/transaction');
const logger = require('../my_modules/mylog');
const my_auth = require('../my_modules/myauth');


/*  */
router.get('/', async function(req, res, next) 
{
    try
    {
        res.render("login", { client_id: my_auth.client_id});
    }
    catch(err)
    {
        logger.error(err);
    }
});

router.post('/', async function(req, res, next) 
{
    try
    {
        const id_token = req.body.idtoken;
        if(id_token)
        {
            const google_user = await my_auth.verify(id_token);

            if(google_user.sub)
            {
                await tr.do(async () =>
                {
                    let user = (await tr.query('select * from user where sub=?', [google_user.sub]))[0];
                    
                    if(!user)
                    {
                        user = 
                        {
                            sub: google_user.sub,
                            name: google_user.name,
                            lat: 37.523613, 
                            lng: 139.937531,
                            icon_id: Math.floor(Math.random() * 100) % 5 + 1
                        };

                        const results = await tr.query('insert into user set ?', [user]);
                        user.id = results.insertId;
                    }

                    logger.info("login: ", user);

                    res.cookie('sub', google_user.sub);
                    res.cookie('user_id', user.id);
                    res.cookie('name', google_user.name);
                    res.send({status: "valid", url: `${config.host.ip_address}:${config.host.port}`});
                });
            }
            else
            {
                res.send('invalid token');
            }
        }
        else
        {
          res.send('no token');
        }
    }
    catch(ex)
    {
        logger.error(ex);
    }
});

router.auth = async (req, res, next) => 
{
    try
    {
        const sub = req.cookies.sub;
        if(sub)
        {
            logger.info(`request from ${req.cookies.name} to "${req.url}"`);
            const results = await tr.query('select * from user where sub=?', [sub]);

            if(results.length)
            {
                next();
                return;
            }
        }

        if(req.url == "/login") next();
        else
        {
            logger.info("login request");
            res.redirect(302, "/login");
        }
    }
    catch(err)
    {
        logger.error(err);
    }
};

module.exports = router;
