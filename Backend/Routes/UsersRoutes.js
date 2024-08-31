const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UsersController')
const authMiddleware = require('../middleware/authMiddleware') // Import the auth middleware

// Route for user login
router.post('/login', UserController.login)

router.put('/change_password', UserController.changePassword)

router.put('/update', UserController.updateUser)

// Route to Send Contact
router.post('/contactus', UserController.contactUs)
// Route for getting user information
router.get('/info', authMiddleware, UserController.getUserInfo) // Protected route

router.get('/manageusers', UserController.getUsers)

router.delete('/deleteusers', UserController.deleteUser)

router.post('/reviews', UserController.fetchUserReview)
router.post('/orders', UserController.fetchUserOrder)
module.exports = router
