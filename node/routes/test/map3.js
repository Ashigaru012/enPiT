const express = require('express');
const router = express.Router();
const db = require('../../my_modules/mydb');
const axios = require('axios');


const range_lng = 0.02, range_lat = 0.02;

/*  */
router.get('/:user_id', function(req, res, next) 
{
    const user_id = req.params.user_id;

    const footer_links = 
    {
        map_link: `http://localhost:3000/test/map3/${user_id}`,
        chat_link: `http://localhost:3000/test/rooms/${user_id}`,
        ranking_link: "#",
        mypage_link: "#"
    };

    console.log(footer_links);

    const response = (lat, lng) =>
    {
        const zoom = 13;
        const w = 414;
        const h = 736;
        const maptype = "terrain";
        const key = "AIzaSyA2RXleFbdbftt8uRjIDj41jbGdWZ3LlpI";
        
        const instance = axios.create({
            'responseType': 'arraybuffer',
            'headers': {
                'Content-Type': 'image/png'
            }
        });
        instance.get(`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${w}x${h}&maptype=${maptype}&key=${key}`).then(response =>
        {
            //console.log(response.data);
            
            const mapimg = "data:image/png;base64," + Buffer.from(response.data, 'binary').toString('base64');
            
            res.render('test/map3', {footer_links: footer_links, user_id: user_id, lat: lat, lng: lng, mapimg: mapimg, zoom: zoom, map_w: w, map_h: h});
        });
    };

    // lat : 緯度, lng : 経度
    const center = req.query.center;

    if(center)
    {
        const lat = center.split(",")[0];
        const lng = center.split(",")[1];

        response(lat, lng);
    }
    else
    {
        db.query('select * from users where id=?', user_id, (error, results) => 
        {
            const lat = results[0].lat;
            const lng = results[0].lng;

            response(lat, lng);
        });
    }
});


const ws_lookup = new Map();
const id_lookup = new Map();

router.ws('/web-sock', (ws, req) => 
{
    console.log("new connection");

    ws.on('message', message => 
    {
        console.log('Received - ', message);

        const event = JSON.parse(message);
        if(event.key == 'on_connect')
        {
            const host = 
            {
                id: null,
                user_id: event.user_id,
                range: event.range,
                lat: event.lat,
                lng: event.lng
            };

            db.query('insert into hosts_test set ?', host, (error, results) => 
            {
                if(error) throw error;
    
                console.log(`add new host(user_id: ${host.user_id})`);
                
                ws_lookup.set(ws, host);
                id_lookup.set(host.user_id, ws);

                db.query('select * from antenna_test2 where ((lat >= ?) and (lat <= ?)) and ((lng >= ?) and (lng <= ?))', 
                    [host.lat - range_lat, host.lat + range_lat, host.lng - range_lng, host.lng + range_lng], (error, results) => 
                {
                    if(error) throw error;

                    for(const antenna of results)
                    {
                        ws.send(JSON.stringify({
                            key: "on_add_antenna",
                            antenna: {
                                user_id: antenna.user_id,
                                lat: antenna.lat,
                                lng: antenna.lng
                            }
                        }));
                    }

                    db.query('select * from requests_test2 where ((lat >= ?) and (lat <= ?)) and ((lng >= ?) and (lng <= ?))', 
                        [host.lat - range_lat, host.lat + range_lat, host.lng - range_lng, host.lng + range_lng], (error, results) => 
                    {
                        for(const request of results)
                        {
                            request.key = "on_add_request";
                            if(host.user_id != request.user_id)
                                ws.send(JSON.stringify(request));
                        }
                    });

                });
            });
        }
        else if(event.key == 'on_add_antenna')
        {
            const antenna = 
            {
                id: null,
                user_id: event.user_id,
                lat: event.lat,
                lng: event.lng
            };

            db.query('insert into antenna_test2 set ?', antenna, (error, results) => 
            {
                if(error) throw error;
    
                console.log(`add new antenna(user_id: ${antenna.user_id})`);

                db.query('select * from hosts_test where (user_id != ?) and ((lat >= ?) and (lat <= ?)) and ((lng >= ?) and (lng <= ?))', 
                    [antenna.user_id, antenna.lat - range_lat, antenna.lat + range_lat, antenna.lng - range_lng, antenna.lng + range_lng], (error, results) => 
                {
                    if(error) throw error;

                    for(const host of results)
                    {
                        if(!id_lookup.has(host.user_id)) continue;

                        id_lookup.get(host.user_id).send(JSON.stringify({
                            key: "on_add_antenna",
                            antenna: {
                                user_id: event.user_id,
                                lat: event.lat,
                                lng: event.lng
                            }
                        }));
                    }
                });
            });
        }
        else if(event.key == 'on_remove_antenna')
        {
            remove_antenna(event.user_id)
        }
    });
  
    ws.on('close', () => 
    {
        const user_id = ws_lookup.get(ws).user_id;
        console.log(user_id + " が切断されました");
        db.query('delete from hosts_test where user_id=?', user_id, (error, results) => 
        {
            if(error) throw error;
            
            ws_lookup.delete(ws);
            id_lookup.delete(user_id);

            console.log(`remove host(user_id: ${user_id}) from lookup table`);

            remove_antenna(user_id);
        });
    });
});

const remove_antenna = (user_id, proc)=>
{
    db.query('delete from antenna_test2 where user_id=?', user_id, (error, results) => 
    {
        if(error) throw error;
        
        if(results.affectedRows >= 1)
        {
            console.log(`delete antenna(user_id: ${user_id})`);
            
            db.query('select * from hosts_test where user_id != ?', user_id, (error, results) => 
            {
                if(error) throw error;

                for(const host of results)
                {
                    if(!id_lookup.has(host.user_id)) continue;
                    
                    id_lookup.get(host.user_id).send(JSON.stringify({
                        key: "on_remove_antenna",
                        user_id: user_id
                    }));
                }

                if(proc) proc();
            });
        }
    });
}

const notify_request = (request) =>
{
    db.query('select * from users where ((lat >= ?) and (lat <= ?)) and ((lng >= ?) and (lng <= ?))', 
        [request.lat - range_lat, request.lat + range_lat, request.lng - range_lng, request.lng + range_lng], (error, results) => 
    {
        if(error) throw error;

        request.key = "on_add_request";

        console.log(request);

        for(const user of results)
        {
            if(id_lookup.has(user.id))
            {
                id_lookup.get(user.id).send(JSON.stringify(request));
            }
        }
    });
};


/*
    ・コネクション成立時
    front -> back
    {
        user_id,
        lat,
        lng
    }
    back
    {
        データベースにホストの情報を記載
    }

    ・コネクション中
    back -> front
    {
        新規で生成されたアンテナの情報をホストに流す
    }

    ・コネクション切断時
    back
    {
        データベース上からホストの情報を削除
    }
    front -> back
    {
        user_id,
        event_kind,
        value,
    }

    back
    user_idから座標取得できる
    座標情報から、近くにいるホストを特定できる
    特定したホストにイベントが発生したことをリアルタイムに伝える
*/


router.notify_request = notify_request;
module.exports = router;
