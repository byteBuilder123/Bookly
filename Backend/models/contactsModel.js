// contactsModel.js
const db = require('../db');
module.exports = {
  saveContactMessage: function(userId, subject, message) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO contactmessages (user_id, subject, message, timestamp) VALUES (?, ?, ?, NOW())';
      db.query(sql, [userId, subject, message], function(error, results, fields) {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
};

