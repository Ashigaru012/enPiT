
const db = require('../my_modules/mydb');
const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    db.query('SELECT * FROM test_table', (error, results) => 
    {
        let user;
        console.log(results);
        user = results[0].name;
        console.log(user);
        res.render('test-database', { title: user });
    });
});


module.exports = router;