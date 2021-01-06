const express = require('express');
const router = express.Router();
const db = require('../../my_modules/mydb');
const axios = require('axios');

/*  */
router.get('/', function(req, res, next) 
{
    // lat : 緯度, lng : 経度
    const center = req.query.center;
    const lat = center.split(",")[0];
    const lng = center.split(",")[1];

    const anntenas = [];
    db.query('SELECT * FROM antenna_test', (error, results) => 
    {
        if(error) throw error;

        for(let anntena of results)
        {
            anntenas.push({lat: anntena.lat, lng: anntena.lng});
        }
        console.log(anntenas);

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
            
            res.render('test/map2', {lat: lat, lng: lng, anntenas: anntenas, mapimg: "data:image/png;base64," + Buffer.from(response.data, 'binary').toString('base64'), zoom: zoom, map_w: w, map_h: h});
        });
    });
});


module.exports = router;
