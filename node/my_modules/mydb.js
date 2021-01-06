const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '172.27.0.2',
    user: 'user',
    password: 'user',
    port: 3306,
    database: 'taskul_db'
    });

connection.connect((err) => {
    if (err) {
        console.log('error connecting: ' + err.stack);
        throw err;
    }
    console.log('success');
});


module.exports = connection;