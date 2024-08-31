// OrderItemController.js

const OrderItemModel = require('../models/OrderItemModel');

class OrderItemController {
  static async createOrderItem(req, res) {
    try {
      const { order_id, book_id, quantity, subtotal } = req.body;
      
      const orderItem = await OrderItemModel.createOrderItem(order_id, book_id, quantity, subtotal);
      res.status(201).json({ success: true, orderItem });
    } catch (error) {
      console.error('Error creating order item:', error);
      res.status(500).json({ success: false, message: 'Failed to create order item' });
    }
  }

  // You can add additional controller methods here for handling other CRUD operations for order items.
}

module.exports = OrderItemController;
