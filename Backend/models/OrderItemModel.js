// OrderItemModel.js

const pool = require('../db');

class OrderItemModel {
  static async createOrderItem(orderId, bookId, quantity, subtotal) {
    try {
      const query =
        'INSERT INTO order_items (order_id, book_id, quantity, subtotal) VALUES (?, ?, ?, ?)';
      const [results, fields] = await pool.query(query, [orderId, bookId, quantity, subtotal]);
      const newOrderItemId = results.insertId;
      return {
        order_item_id: newOrderItemId,
        order_id: orderId,
        book_id: bookId,
        quantity
      };
    } catch (error) {
      console.error('Error creating order item:', error);
      throw error;
    }
  }

  // You can add additional methods here as needed, such as retrieving order items by order ID, updating order items, or deleting order items.
}

module.exports = OrderItemModel;
