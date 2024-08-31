//ReviewModel.js
const pool = require('../db');

class ReviewModel {
    static async getAllReviews() {
        try {
            const query = 'SELECT * FROM reviews';
            const [rows, fields] = await pool.query(query);
            return rows;
        } catch (error) {
            console.error('Error retrieving reviews:', error);
            throw error;
        }
    }
    static async getUserReviews(userId){
        try {
        const query = `SELECT * FROM reviews WHERE customer_id=${userId}`;
        const [rows, fields] = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error retrieving reviews:', error);
        throw error;
    }
    }

 static async getBooksReviews(book_id) {
    try {
        const query = `SELECT * FROM reviews WHERE book_id=${book_id}`;
        const [rows, fields] = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error retrieving reviews:', error);
        throw error;
    }
}

static async updateReview(reviewData) {
    try {
        const { userId, reviewText, rating,currentReviewId } = reviewData;
        const query = 'UPDATE reviews SET review_text = ?, rating = ? WHERE customer_id = ? AND reviewId = ?';
        const [result] = await pool.query(query, [reviewText, rating, userId, currentReviewId]);
        return result.affectedRows > 0;  // Returns true if a row was updated
    } catch (error) {
        throw error;
    }
}

    static async createReview(reviewData) {
        try {
            const { customer_id, name, book_id, reviewText, rating } = reviewData;
            const query = 'INSERT INTO reviews (customer_id, book_id ,customer_name, review_text, rating) VALUES (?, ?, ?, ?, ?)';
            const [result] = await pool.query(query, [customer_id, book_id,name, reviewText, rating]);
            return result.insertId; // Return the ID of the newly created review
        } catch (error) {
            throw error;
        }
    }

       static async deleteReview(reviewId) {
    try {
        const query = 'DELETE FROM reviews WHERE reviewId = ?';
        const [results, fields] = await pool.query(query, [reviewId]);
        return results.affectedRows > 0;  // Returns true if a row was deleted
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}
    
}
module.exports = ReviewModel;