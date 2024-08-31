// controllers/reviewController.js
const ReviewModel = require('../models/ReviewModel');
class ReviewController {
    static async getAllReviews(req, res) {
        try {
            const allReviews = await ReviewModel.getAllReviews();
            res.json(allReviews);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async getBooksReviews(req, res) {
    
    const book_id  = req.query.bookId; // Make sure the client sends book_id in the request body
  
    try {
        if (!book_id) {
            // If book_id is missing, return a 400 Bad Request response
            return res.status(400).json({ error: 'Book ID is missing' });
        }

        // Call the ReviewModel to get all reviews for the specified book_id
        const allReviews = await ReviewModel.getBooksReviews(book_id);

        if (allReviews.length === 0) {
            // If no reviews are found for the specified book_id, return a 404 Not Found response
            return res.status(404).json({ error: 'No reviews found for the specified book' });
        }

        // Send the reviews as a JSON response
        res.json(allReviews);
    } catch (error) {
        console.error('Error retrieving reviews:', error);
        // Return a 500 Internal Server Error response with a generic error message
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
    
 static async deleteReviews(req, res) {
    const {reviewId} = req.body
    try {
        const user = await ReviewModel.deleteReview(reviewId);  // Proceed to delete the user
        res.status(200).json({ message: 'reviews deleted successfully' });
    } catch (error) {
        console.error('Failed to delete reviews:', error);
        res.status(500).json({ error: 'Failed to delete reviews' });
    }
}

static async updateReview(req, res) {
    const { userId, reviewText, rating, currentReviewId } = req.body;
    
    try {
        const result = await ReviewModel.updateReview({ userId, reviewText, rating, currentReviewId });
        if (result) {
            res.status(200).json({ message: 'Review updated successfully' });
        } else {
            res.status(404).json({ error: 'Review not found' });
        }
    } catch (error) {
        console.error('Failed to update review:', error);
        res.status(500).json({ error: 'Failed to update review' });
    }
}

    static async submitReview(req, res, next) {
        try {
            const {customer_id, name, book_id, reviewText, rating } = req.body;
            const reviewId = await ReviewModel.createReview({ customer_id, name, book_id, reviewText, rating});
            res.status(201).json({ reviewId });
        } catch (error) {
            next(error);
        }
    }
}
module.exports = ReviewController;