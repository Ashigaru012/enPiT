const express = require('express');
const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) 
{
    const addr = req.query.addr;
    console.log(addr);
    res.render('test/map', {addr: addr});
});


module.exports = router;
