const express = require('express')
const session = require('express-session')
const cors = require('cors')
const errorhandler = require('./middleware/errorHandlerMiddleware.js')
const databaseMiddleware = require('./middleware/DatabaseMiddleware.js')
const authMiddleware = require('./middleware/authMiddleware.js')
const dotenv = require('dotenv')
dotenv.config()
const BooksRoutes = require('./Routes/booksRoutes.js')
const searchRoutes = require('./Routes/searchRoutes.js')
const authStatusRoutes = require('./Routes/authStatusRoutes.js')
const reviewRoutes = require('./Routes/reviewRoutes.js')
const contactsRoutes = require('./Routes/contactsRoutes.js')
const UsersRoutes = require('./Routes/UsersRoutes.js')
const registerRoutes = require('./Routes/registerRoutes.js')
const OrderRoutes = require('./Routes/OrderRoutes.js')
const cartRoutes = require('./Routes/cartRoutes.js')
const OrderItemRoutes = require('./Routes/OrderItemRoutes.js')
const pool = require('./db')

// Create Express app
const app = express()
const SESSION_SECRET = process.env.SESSION_SECRET || 'bookstore123'
const API_PREFIX = '/api'
const jwtSecret = process.env.JWT_SECRET

// Configure CORS middleware
app.use(cors({
  origin: 'http://127.0.0.1:5502',
  credentials: true
}))

// Configure session middleware
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

// Parse incoming requests with JSON payloads
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Middleware for database connection
app.use(databaseMiddleware)

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
  next()
})

// Mount routes
app.use(`${API_PREFIX}/books/search`, searchRoutes)
app.use(`${API_PREFIX}/books`, BooksRoutes)
app.use(`${API_PREFIX}/reviews`, reviewRoutes)
app.use(`${API_PREFIX}/contact`, contactsRoutes)
app.use(`${API_PREFIX}/users`, UsersRoutes)
app.use(`${API_PREFIX}/user`, registerRoutes)
app.use(`${API_PREFIX}/cart`, cartRoutes)
app.use(`${API_PREFIX}/auth`, authStatusRoutes)
app.use(`${API_PREFIX}/v2`, OrderRoutes)
app.use(`${API_PREFIX}/orders`, OrderRoutes)
app.use(`${API_PREFIX}/order_items`, OrderItemRoutes) // Adjusted to maintain consistency
// Error handler middleware
app.use(errorhandler)

// Start server
const PORT = process.env.PORT || 5003
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
