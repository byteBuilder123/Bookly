// ../database/books.js

const mysql = require('mysql');
const dbConfig = require('../db'); // Configuration file for database connection

// Create a connection pool using the configuration
const pool = mysql.createPool(dbConfig);

// Function to fetch all books from the database
function getAllBooks(callback) {
  pool.query('SELECT * FROM books', (error, results, fields) => {
    if (error) {
      return callback(error, null);
    }
    return callback(null, results);
  });
}

// Other functions to interact with the books table...

module.exports = {
  getAllBooks,
  // Other exported functions...
};
