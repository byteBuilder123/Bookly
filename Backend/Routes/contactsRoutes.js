//contactsRoutes
const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contactsController');

// POST request to submit contact form
router.post('/submit', contactsController.submitContactForm);

module.exports = router;
