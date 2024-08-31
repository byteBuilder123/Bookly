// OrderController.js

const OrderModel = require('../models/OrderModel');
const axios = require('axios');
const { apiPublicKey, apiSecretKey } = require('../config.js');



class OrderController {
  static async getAllOrders(req, res) {
    try {
      const orders = await OrderModel.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error('Error retrieving orders:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

 static async initializeTransaction(req, res) {
  try {
    const { amount, cardNumber, cardExpMonth, cardExpYear, cardCvv, reference, email, currency } = req.body;

    const response = await axios.post(
      "https://api.budpay.com/api/v2/transaction/initialize",
      {
        amount,
        cardNumber,
        cardExpMonth,
        cardExpYear,
        cardCvv
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiPublicKey,
          "X-API-Secret": apiSecretKey,
        },
      }
    );

    if (response.data.success) {
      res.json({ success: true, message: "Payment successful!" });
    } else {
      res.json({ success: false, message: "Payment failed." });
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the payment.",
    });
  }
}



  static async getOrderById(req, res) {
    const { orderId } = req.params;
    try {
      const order = await OrderModel.getOrderById(orderId);
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    } catch (error) {
      console.error('Error retrieving order:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async createOrder(req, res) {
    const orderData = req.body;
    try {
      const newOrder = await OrderModel.createOrder(orderData);
      res.status(201).json(newOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // OrderController.js

// ...

static async updateOrderStatus(req, res) {
  const { orderId, status } = req.body;
  try {
      const updated = await OrderModel.updateOrderStatus(orderId, status);
      if (updated) {
          res.status(200).json({ message: 'Order status updated successfully' });
      } else {
          res.status(404).json({ error: 'Order not found' });
      }
  } catch (error) {
      console.error('Failed to update order status:', error);
      res.status(500).json({ error: 'Failed to update order status' });
  }
}

static async deleteOrder(req, res) {
  const { orderId } = req.body;
  try {
      await OrderModel.deleteOrderItems(orderId);  // First, delete the order items
      const deleted = await OrderModel.deleteOrder(orderId);  // Then, delete the order
      if (deleted) {
          res.status(200).json({ message: 'Order deleted successfully' });
      } else {
          res.status(404).json({ error: 'Order not found' });
      }
  } catch (error) {
      console.error('Failed to delete order:', error);
      res.status(500).json({ error: 'Failed to delete order' });
  }
}


}

module.exports = OrderController;