// routes/books.js
const express = require('express')
const router = express.Router()
const BookController = require('../controllers/BooksController')

// Search books route
// router.get('/search', BookController.searchBooks)
router.get('/file', BookController.searchBooks)

module.exports = router
