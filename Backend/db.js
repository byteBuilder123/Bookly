const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bookstore',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Immediately invoked async function to handle database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to the database successfully');
    connection.release();
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
})();

// Handle pool errors
pool.on('error', (err) => {
  console.error('Pool error:', err);
});

module.exports = pool;
