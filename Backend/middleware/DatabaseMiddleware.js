const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'database_name',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware function to handle database connection
const databaseMiddleware = async (req, res, next) => {
  try {
    // Attach the database pool to the request object
    req.pool = pool;
    console.log('Connected to the database successfully');
    next();
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = databaseMiddleware;
