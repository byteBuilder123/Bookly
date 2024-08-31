// authStatusRoutes.js

const express = require('express')
const router = express.Router()

// Middleware for authentication
const authMiddleware = require('../middleware/authMiddleware')

// Route to check authentication status
router.get('/status', authMiddleware, (req, res) => {
  res.json({ isLoggedIn: true }) // Assuming user is logged in if authentication middleware passes
})

// authRoutes.js
router.post('/logout', authMiddleware, (req, res) => {
  // Invalidate the token
  // This depends on how you handle tokens on the server
  // For JWT, you might need to use a token blacklist
  res.json({ message: 'Logged out' })
})

module.exports = router
