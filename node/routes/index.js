const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');
const tr = require('../my_modules/transaction');
const logger = require('../my_modules/mylog');
const common = require("../my_modules/common");

const zoom = 13;
const w = 414;
const h = 736;
const maptype = "terrain";
const key = config.api.map.key;

const range = 100;

/*  */
router.get("/", async function(req, res, next) 
{
    try
    {
        logger.info("client cookies: ", req.cookies);
        const user_id = req.cookies.user_id;
        const sub = req.cookies.sub;

        const response = async (lat, lng) =>
        {
            await tr.do(async () =>
            {
                const user = await tr.query('select * from user where id=?', [user_id]);
                const icon = await tr.query('select * from sample_icon where id=?', [user[0].icon_id]);

                const instance = axios.create({
                    'responseType': 'arraybuffer',
                    'headers': {
                        'Content-Type': 'image/png'
                    }
                });

                await instance.get(`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${w}x${h}&maptype=${maptype}&key=${key}`).then(response =>
                {
                    const mapimg = "data:image/png;base64," + Buffer.from(response.data, 'binary').toString('base64');
                    
                    res.render('index', {common: common, user_id: user[0].id, user_icon_img: icon[0].img, lat: lat, lng: lng, mapimg: mapimg, zoom: zoom, map_w: w, map_h: h});
                })
                .catch(error => 
                {
                    if (error.response) logger.error(error.response);
                    else if (error.request) logger.error(error.request);
                    else logger.error('Error', error.message);

                    logger.error(error.config);
                    
                    throw error;
                });
            });
        };


        const user = (await tr.query('select * from user where sub=?', sub))[0]; 
        await response(user.lat, user.lng);
    }
    catch(err)
    {
        logger.error(err);
    }
});




const ws_lookup = new Map();
const id_lookup = new Map();

const update_map = async (host) =>
{
    await tr.query('update user set lat=?, lng=? where id=?', [host.lat, host.lng, host.user_id]); 

    const instance = axios.create({
        'responseType': 'arraybuffer',
        'headers': {
            'Content-Type': 'image/png'
        }
    });
    
    await instance.get(`https://maps.googleapis.com/maps/api/staticmap?center=${host.lat},${host.lng}&zoom=${zoom}&size=${w}x${h}&maptype=${maptype}&key=${key}`).then(response =>
    {
        const mapimg = "data:image/png;base64," + Buffer.from(response.data, 'binary').toString('base64');
        
        id_lookup.get(host.user_id)?.send(JSON.stringify({
            key: "on_map_update",
            mapimg: mapimg
        }));
    })
    .catch(error => 
    {
        if (error.response) logger.error(error.response);
        else if (error.request) logger.error(error.request);
        else logger.error('Error', error.message);

        logger.error(error.config);
        
        throw error;
    });
};

const retrieve_antenna = async (host) =>
{
    logger.info("retrieve_antenna: ", host);
    
    const results = await tr.query('select * from antenna where ((lat >= ?) and (lat <= ?)) and ((lng >= ?) and (lng <= ?))', [host.lat - range, host.lat + range, host.lng - range, host.lng + range]);
    
    for(const antenna of results)
    {
        const icon = (await tr.query('select * from sample_icon where id=?', antenna.icon_id))[0];

        antenna.icon_img = icon.img;

        id_lookup.get(host.id)?.send(JSON.stringify({
            key: "on_add_antenna",
            antenna: antenna
        }));
    }
};

const add_antenna = async (user_id) =>
{
    await tr.do(async () =>
    {
        const user = (await tr.query('select * from user where id=?', [user_id]))[0];

        const antenna = 
        {
            user_id: user_id,
            lat: user.lat,
            lng: user.lng,
            icon_id: user.icon_id
        };
        
        logger.info("new antenna: ", antenna);
        
        await tr.query('insert into antenna set ?', antenna);

        const results = await tr.query('select * from user where (id != ?) and ((lat >= ?) and (lat <= ?)) and ((lng >= ?) and (lng <= ?))', [antenna.user_id, antenna.lat - range, antenna.lat + range, antenna.lng - range, antenna.lng + range])
        
        for(const item of results)
        {
            const icon = (await tr.query('select * from sample_icon where id=?', antenna.icon_id))[0];
            antenna.icon_img = icon.img;

            id_lookup.get(item.id)?.send(JSON.stringify({ key: "on_add_antenna", antenna: antenna }));
        }
    });
};

const remove_antenna = async (user_id)=>
{
    await tr.do(async () =>
    {
        const results = await tr.query('delete from antenna where user_id=?', user_id);

        if(results.affectedRows >= 1)
        {
            logger.info(`removed antenna(user_id: ${user_id})`);
            const results = await tr.query('select * from user where id != ?', user_id);
            
            for(const host of results)
            {
                if(!id_lookup.has(host.id)) continue;
                
                id_lookup.get(host.id)?.send(JSON.stringify({
                    key: "on_remove_antenna",
                    user_id: user_id
                }));
            }
        }
    });
};

const retrieve_request = async (host) =>
{
    logger.info("retrieve_request: ", host);

    let requests = await tr.query('select * from request where ((lat >= ?) and (lat <= ?)) and ((lng >= ?) and (lng <= ?)) and user_id!=? order by id asc', [host.lat - range, host.lat + range, host.lng - range, host.lng + range, host.user_id]);
    
    if(requests.length)
    {
        const request_ids = requests.map(v=>v.id);

        const remove_requests = await tr.query('select * from applicant where user_id=? and request_id in(?) order by request_id asc', [host.user_id, request_ids]);

        const remove_ids = remove_requests.map(v => v.request_id);

        requests = requests.filter(v => !remove_ids.includes(v.id));

        logger.info(requests);
    }

    const websock = id_lookup.get(host.user_id);

    for(const req of requests)
    {
        req.key = "on_add_request";
        websock?.send(JSON.stringify(req));
    }
};

const notify_request = async (request) =>
{
    logger.info("notify_request", request);

    const antennas = await tr.query('select * from antenna');

    const ids = antennas.map(v => v.user_id);

    if(ids.length)
    {  
        const results = await tr.query('select * from user where ((lat >= ?) and (lat <= ?)) and ((lng >= ?) and (lng <= ?)) and id!=? and id in(?)', [request.lat - range, request.lat + range, request.lng - range, request.lng + range, request.user_id, ids]);
        
        request.key = "on_add_request";
    
        for(const user of results)
        {
            const websock = id_lookup.get(user.id);
            
            websock?.send(JSON.stringify(request)); 
        }
    }
};

const accept_request = async (event) =>
{
    await tr.do(async () =>
    {
        logger.info("accept_request", event);

        await tr.query('insert into applicant set ?', {request_id: event.request_id, user_id: event.user_id});

        const room = (await tr.query('select * from chat_room where request_id=?', [event.request_id]))[0]; 

        await tr.query('insert into chat_member set ?', {room_id: room.id, user_id: event.user_id});

        id_lookup.get(event.user_id)?.send(JSON.stringify({
            key: "on_accepted_request",
            request_id: event.request_id,
            url: `${config.host.protocol}://${config.host.ip_address}:${config.host.port}/rooms/${room.id}`
        }));
    });
}

const close = async (ws) =>
{
    if(ws_lookup.has(ws))
    {
        const host = ws_lookup.get(ws);
        id_lookup.delete(host.user_id);

        const user = (await tr.query('select * from user where id=?', [host.user_id]))[0];

        logger.info("disconnection: ", user);
        
        await remove_antenna(host.user_id);
    }
    else
    {
        logger.warn("unknown host desconnect");
    }
}


router.ws('/web-sock', async (ws, req) => 
{
    ws.on('message', async (message) => 
    {
        try
        {
            logger.info('Received - ', message);

            const event = JSON.parse(message);
            if(event.key == 'on_connect')
            {
                const host = 
                {
                    user_id: event.user_id,
                    lat: event.lat,
                    lng: event.lng
                };
                logger.info("new host: ", host);


                await tr.do(async () =>
                {
                    if(host.lat && host.lng) update_map(host)

                    const user = (await tr.query('select * from user where id=?', [host.user_id]))[0];
                    
                    ws_lookup.set(ws, host);
                    id_lookup.set(host.user_id, ws);

                    logger.info("new connection: ", user);

                    await retrieve_antenna(user);
                });
            }
            else if(event.key == 'on_add_antenna')
            {
                await add_antenna(event.user_id);
                
                await retrieve_request(event);
            }
            else if(event.key == 'on_remove_antenna')
            {
                await remove_antenna(event.user_id);
            }
            else if(event.key == 'on_accept')
            {
                await accept_request(event);
            }
        }
        catch(err)
        {
            logger.error(err);
        }
    });
    
    ws.on('close', async () => 
    {
        try
        {
            await close(ws);
        }
        catch(err)
        {
            logger.error(err);
        }
    });

    ws.onerror = async (err) =>
    {
        try
        {
            logger.error("disconnect error: ", err);
            await close(ws);
        }
        catch(err)
        {
            logger.error(err);
        }
    } 
});


router.notify_request = notify_request;
module.exports = router;
