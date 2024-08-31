const express = require('express')
const router = express.Router()

const CartController = require('../controllers/CartController')

router.post('/add-to-cart', CartController.addToCart)
router.delete('/remove-from-cart', CartController.removeFromCart)
router.get('/cart-items', CartController.getCartItems)
router.delete('/clear-cart', CartController.clearCart)
router.post('/users-cart', CartController.getUsersCartItems)

module.exports = router
