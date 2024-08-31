const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviewController')

// Route for submitting a review
router.post('/submit', reviewController.submitReview)
// Route to get book reviews from the database
router.get('/get', reviewController.getBooksReviews)
// Route to get book reviews from the database
router.delete('/delete', reviewController.deleteReviews)

// Route to update rating in database
router.put('/update', reviewController.updateReview)
// Fetch all books
router.get('/', reviewController.getAllReviews)

module.exports = router
