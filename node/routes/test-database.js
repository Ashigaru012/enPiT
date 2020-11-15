const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '172.27.0.2',
    user: 'user',
    password: 'user',
    port: 3306,
    database: 'test_database'
    });

connection.connect((err) => {
    if (err) {
        console.log('error connecting: ' + err.stack);
        throw err;
    }
    console.log('success');
});


const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    connection.query('SELECT * FROM test_table', (error, results) => 
    {
        let user;
        console.log(results);
        user = results[0].name;
        console.log(user);
        res.render('test-database', { title: user });
    });


});


module.exports = router;