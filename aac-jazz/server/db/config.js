const mysql = require('mysql2/promise'); // Import the MySQL library 
require('dotenv').config();

// Create a connection pool for mySQL database with environment variables
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connection conditional 
connection.getConnection()
  .then(conn => {
    console.log('Connected to the MySQL database');
    conn.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

module.exports = connection;

