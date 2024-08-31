const pool = require('../db');

class CartModel {
    static async addToCart(user_id, bookId, quantity, callback) {
        try {
            const orderDate = new Date().toISOString().split('T')[0];
            const orderTime = new Date().toISOString().split('T')[1].substring(0, 8);           
            const sql = 'INSERT INTO cart (user_id, book_id, quantity, order_date, order_time) VALUES (?, ?, ?, ?, ?)';
            const result = await pool.query(sql, [user_id, bookId, quantity, orderDate, orderTime]);
            callback(null, result);
        } catch (error) {
            console.error('Error adding to cart:', error);
            callback(error, null);
        }
    }

static async removeFromCart(bookId,user_id) {
        try {
            const query = 'DELETE FROM cart WHERE book_id = ? AND user_id = ?';
            await pool.query(query, [bookId, user_id]);
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    }

static async getCartItems() {
        try {
            const query = 'SELECT cart.*, books.title FROM cart JOIN books ON cart.book_id = books.book_id';
            const [results, fields] = await pool.query(query);
            return results;
        } catch (error) {
            console.error('Error retrieving cart items:', error);
            throw error;
        }
    }

   static async getUsersCartItems(user_id) {
    try {
        const query = 'SELECT cart.*, books.title, books.price FROM cart JOIN books ON cart.book_id = books.book_id WHERE cart.user_id = ?';
        const [results, fields] = await pool.query(query, [user_id]);
        return results;
    } catch (error) {
        console.error('Error retrieving cart items:', error);
        throw error;
    }
}

static async clearCart(userId) {
    try {
        const query = 'DELETE FROM cart WHERE user_id = ?';
        await pool.query(query, [userId]);  // Pass the userId to the query
    } catch (error) {
        console.error('Error clearing cart for user:', error);
        throw error;
    }
}

}

module.exports = CartModel;
