// routes/books.js
const express = require('express')
const router = express.Router()
const BookController = require('../controllers/BooksController')

router.get('/fetchCategories', BookController.getCategories)
// Fetch all books
router.get('/', BookController.getAllBooks)

// Fetch all books
router.get('/managebooks', BookController.getAllBooks)

router.delete('/deletebooks', BookController.deleteBook)

router.delete('/deletecategories', BookController.deleteCategories)

router.put('/updatebook', BookController.updateBook)

router.put('/updatecategory', BookController.updateCategory)

router.get('/it_books', BookController.getAllITBooks)

// Fetch featured books
router.get('/featured', BookController.getFeaturedBooks)

// Fetch new arrivals
router.get('/newarrivals', BookController.getNewArrivals)

// Route to get books by genre
router.get('/books/:genre', BookController.getBooksByGenre)

// Fetch books by genre
router.get('/genre/:genre', BookController.getBooksByGenre)

// Fetch a specific book by ID
router.get('/:bookId', BookController.getBookById)

// routes.js
router.post('/addcategory', BookController.createCategory)

// Create a new book
router.post('/addbooks', BookController.createBook)

// Search books route
router.get('/search', BookController.searchBooks)

module.exports = router
