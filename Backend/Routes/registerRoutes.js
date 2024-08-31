const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UsersController')

router.post('/register', UserController.register)
// Route for user registration

module.exports = router