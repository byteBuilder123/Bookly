// exampleRoute.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Protected route requiring authentication
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Protected route accessible with authentication' });
});

module.exports = router;
