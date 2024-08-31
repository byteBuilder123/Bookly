// orderItemRoutes.js

const express = require('express')
const router = express.Router()
const OrderItemController = require('../controllers/OrderItemController')

// Route to create a new order item
router.post('/add', OrderItemController.createOrderItem)

// You can define additional routes for other CRUD operations on order items here

module.exports = router
