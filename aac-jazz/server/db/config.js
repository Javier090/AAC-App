const mysql = require('mysql2/promise'); // Import the MySQL library
require('dotenv').config();

const connection = mysql.createPool({
  host: process.env.DB_HOST,    // Use the public IP address of your Cloud SQL instance
  user: process.env.DB_USER,    // Use the database username (typically 'root')
  password: process.env.DB_PASSWORD, // Use the database password
  database: process.env.DB_NAME // Your database name
});

connection.getConnection()
  .then(conn => {
    console.log('Connected to the MySQL database');
    conn.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

module.exports = connection;
