const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',       // DB host
    user: 'root',            // DB username
    password: '',            // DB password
    database: 'eiide', // DB name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise(); 
