const CartModel = require('../models/CartModel');
class CartController {
    static async addToCart(req, res) {
        const { user_id, bookId, quantity } = req.body;
      
        try {
            await CartModel.addToCart(user_id, bookId, quantity, (err, result) => {
                if (err) {
                    res.status(500).send('Error adding to cart');
                    return;
                }
                res.status(200).send('Added to cart successfully');
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).send('Error adding to cart');
        }
    }

    static async removeFromCart(req, res) {
        const { book_id,user_id } = req.body;
        try {
            await CartModel.removeFromCart(book_id, user_id);
            res.status(200).send('Removed from cart successfully');
        } catch (error) {
            console.error('Error removing from cart:', error);
            res.status(500).send('Error removing from cart');
        }
    }

    static async getCartItems(req, res) {
        try {
            const cartItems = await CartModel.getCartItems();
            res.status(200).json(cartItems);
        } catch (error) {
            console.error('Error retrieving cart items:', error);
            res.status(500).send('Error retrieving cart items');
        }
    }

   static async clearCart(req, res) {
    try {
        const userId = req.body.user_id;  // Get user ID from request body
        await CartModel.clearCart(userId);
        res.status(200).send('Cart cleared successfully for user ID: ' + userId);
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).send('Error clearing cart');
    }
}


   static async getUsersCartItems(req, res) {
    const {user_id}  = req.body; // Extract user_id from request parameters

    try {
        if (!user_id) {
            throw new Error('User ID is missing');
        }

        const cartItems = await CartModel.getUsersCartItems(user_id);
        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Error retrieving cart items:', error);
        res.status(500).json({ error: error.message }); // Send error message
    }
}

}

module.exports = CartController;
