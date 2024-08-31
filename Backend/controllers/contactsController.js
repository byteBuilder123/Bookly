//contactsController
const contactModel = require('../models/contactsModel');

module.exports = {
  submitContactForm: function(req, res) {
    const userId = req.body.userId; // Assuming you have a user ID associated with the submission
    const subject = req.body.subject;
    const message = req.body.message;

    contactModel.saveContactMessage(userId, subject, message, function(error, result) {
      if (error) {
        return res.status(500).json({ error: 'Error saving contact message' });
      }
      return res.status(200).json({ message: 'Contact message saved successfully' });
    });
  }
};
