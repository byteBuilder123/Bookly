const express = require('express')
const router = express.Router()
const OrderController = require('../controllers/OrderController')

// Define your routes
router.post('/initializeTransaction', OrderController.initializeTransaction)
// GET all orders
router.get('/fetchOrder', OrderController.getAllOrders)

// GET order by ID
router.get('/orders/:orderId', OrderController.getOrderById)

// POST create a new order
router.post('/create_order', OrderController.createOrder)

// Delete to delete order
router.delete('/deleteOrder', OrderController.deleteOrder)

router.put('/updateOrderStatus', OrderController.updateOrderStatus)

module.exports = router
