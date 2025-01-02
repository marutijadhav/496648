const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost', // Replace with your database host
  user: 'root', // Replace with your MySQL username
  password: 'password123', // Replace with your MySQL password
  database: 'quiz_app', // Replace with your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

module.exports = promisePool;
