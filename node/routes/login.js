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
    const sub = req.cookies.sub;
    logger.info(`request from ${req.cookies.name} to "${req.url}"`);
    if(sub)
    {
        const results = await tr.query('select * from user where sub=?', [sub]);

        if(results.length)
        {
            next();
            return;
        }
    }

    res.render("login", { client_id: my_auth.client_id});
});


router.post('/login', async function(req, res, next) 
{
    try
    {
        const id_token = req.body.idtoken;
        if(id_token)
        {
            const google_user = await my_auth.verify(id_token);

            if(google_user.sub)
            {
                try 
                {
                    await tr.begin();
                    const results = await tr.query('select * from user where sub=?', [google_user.sub]);
                    
                    let user = results[0];
                    if(!results.length)
                    {
                        const one = 
                        {
                            sub: google_user.sub,
                            name: google_user.name,
                            lat: 37.461618,
                            lng: 139.839123
                        };

                        await tr.query('insert into user set ?', [one]);
                        
                        user = one;
                    }

                    console.log(user);

                    await tr.commit();
                    
                    res.cookie('sub', google_user.sub);
                    res.cookie('name', google_user.name);
                    res.send({status: "valid", url: `${config.host.ip_address}:${config.host.port}`});
                }
                catch(err)
                {
                    await tr.rollback(err);
                    throw err;
                }
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
        throw ex;
    }
});


module.exports = router;
