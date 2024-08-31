// OrderModel.js

const pool = require('../db');

class OrderModel {
  static async getAllOrders() {
    try {
      const query = 'SELECT * FROM orders';
      const [rows, fields] = await pool.query(query);
      return rows;
    } catch (error) {
      console.error('Error retrieving orders:', error);
      throw error;
    }
  }

  
 static async deleteOrder(orderId) {
    try {
        const query = 'DELETE FROM orders WHERE order_id = ?';
        const [results, fields] = await pool.query(query, [orderId]);
        return results.affectedRows > 0;  // Returns true if a row was deleted
    } catch (error) {
        console.error('Error deleting order:', error);
        throw error;
    }
}


  static async getOrderById(orderId) {
    try {
      const query = 'SELECT * FROM orders WHERE order_id = ?';
      const [results, fields] = await pool.query(query, [orderId]);
      const order = results.length > 0 ? results[0] : null;
      return order;
    } catch (error) {
      console.error('Error retrieving order by ID:', error);
      throw error;
    }
  }

  static async createOrder(orderData) {
    try {
      const {
        user_id,
        customerName,
        email,
        city,
        address,
        phoneNumber,
        postalCode,
        shippingMethod,
        paymentMethod,
        subTotal,
        total,
        order_date = new Date().toISOString().slice(0, 10) // defaulting to current date if not provided
      } = orderData;
      const order_status = 'Active'; // default status

      // Updated SQL query to include all fields
      const query = `
        INSERT INTO orders (
          user_id,
          customer_name,
          customer_email,
          city,
          address,
          phone_number,
          postal_code,
          shipping_method,
          payment_method,
          order_date,
          sub_total,
          total,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      // Execute the query with all parameters
      const [results] = await pool.query(query, [
        user_id,
        customerName,
        email,
        city,
        address,
        phoneNumber,
        postalCode,
        shippingMethod,
        paymentMethod,
        order_date,
        subTotal,
        total,
        order_status
      ]);

      const newOrderId = results.insertId;

      // Return the new order details, including the new order_id
      return {
        order_id: newOrderId,
        user_id
      }
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

     static async getUserOrder(userId) {
    try {
        // SQL query that joins orders, order_items, and books tables
        const query = `
            SELECT 
    o.order_id,
    o.order_date,
    o.status,
    b.title AS book_name,
    SUM(oi.quantity) AS total_quantity,
    SUM(oi.subtotal) AS total_amount
FROM 
    orders o
    INNER JOIN order_items oi ON o.order_id = oi.order_id
    INNER JOIN books b ON oi.book_id = b.book_id
WHERE 
    o.user_id = ${userId}
GROUP BY 
    o.order_id,
    o.order_date,
    o.status,
    b.title
ORDER BY 
    o.order_date DESC;

        `;

        const [rows, fields] = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error retrieving orders with book names:', error);
        throw error;
    }
}

// OrderModel.js

// ...

static async updateOrderStatus(orderId, status) {
  try {
      const query = 'UPDATE orders SET status = ? WHERE order_id = ?';
      const [results, fields] = await pool.query(query, [status, orderId]);
      return results.affectedRows > 0;  // Returns true if a row was updated
  } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
  }
}

static async deleteOrderItems(orderId) {
  try {
      const query = 'DELETE FROM order_items WHERE order_id = ?';
      const [results, fields] = await pool.query(query, [orderId]);
      return results.affectedRows > 0;  // Returns true if any row was deleted
  } catch (error) {
      console.error('Error deleting order items:', error);
      throw error;
  }
}

// ...

}

module.exports = OrderModel;