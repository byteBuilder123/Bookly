const bcrypt = require('bcrypt');
const pool = require('../db');

class UserModel {
    static async createUser(username, password, email) {
        try {
            const query = 'INSERT INTO user (username, password, email, isAdmin) VALUES (?, ?, ?,"0")';
            const [results, fields] = await pool.query(query, [username, password, email]);
            return results.insertId;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

 static async changePassword(userId, oldPassword, newPassword) {
    try {
        const user = await this.getUserById(userId);
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!passwordMatch) {
            // Throw an error instead of using res to handle response
            throw new Error("Invalid password");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const query = 'UPDATE user SET password = ? WHERE user_id = ?'; // Correct the SQL query to specify which user's password to update
        await pool.query(query, [hashedPassword, userId]); // Include userId to ensure correct user update
        return true; // Return true to indicate success
    } catch (error) {
        console.error('Error changing password:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}


 static async contactUs(name, email, phone, message) {
  try {
    // Validate input data
    if (!name || !email || !phone || !message) {
      throw new Error('Please provide all required information');
    }

    const query = 'INSERT INTO contactUs (name, email, phone_number,message) VALUES (?, ?, ?, ?)';
    const [results, fields] = await pool.query(query, [name, email, phone, message]);
    
    return true; // Indicate success
  } catch (error) {
    console.error('Error storing contact', error);
    throw error;
  }
}

    static async getUserByUsername(username) {
        try {
            const query = 'SELECT * FROM user WHERE username = ?';
            
            const [results, fields] = await pool.query(query, [username]);
            
            if (results.length === 0) {
                return null; // User not found
            }
            
            return results[0];
        } catch (error) {
            console.error('Error retrieving user by username:', error);
            throw error;
        }
    }
    
    static async getUserById(userId) {
        try {
            const query = 'SELECT * FROM user WHERE user_id = ?';
            const [results, fields] = await pool.query(query, [userId]);
            if (results.length === 0) {
                return null; // User not found
            }
            return results[0];
        } catch (error) {
            console.error('Error retrieving user by ID:', error);
            throw error;
        }
    }

    // Get all users
    static async getUsers() {
        try {
            const query = 'SELECT * FROM user';
            const [results, fields] = await pool.query(query);
            if (results.length === 0) {
                return null; // User not found
            }
            return results;
        } catch (error) {
            console.error('Error retrieving user by ID:', error);
            throw error;
        }
    }

     static async deleteUser(username) {
    try {
        // Check if the user exists and is not an admin
        const checkAdminQuery = 'SELECT * FROM USER WHERE username = ?';
        const [adminRows, adminFields] = await pool.query(checkAdminQuery, [username]);

        if (adminRows.length === 0) {
            throw new Error('User not found.'); // Throw an error if user not found
        }

        const admin = adminRows[0]; // Assuming username is unique

        if (admin.isAdmin) {
            throw new Error("You cannot delete an admin user."); // Throw an error if user is admin
        }

        // Proceed with deletion if the user exists and is not an admin
        const deleteQuery = 'DELETE FROM user WHERE username = ?';
        const [results, fields] = await pool.query(deleteQuery, [username]);
        
        return results.affectedRows > 0;  // Returns true if a row was deleted
    } catch (error) {
        console.error('Error deleting user:', error.message);
        throw error; // Re-throw the error for higher-level handling
    }
}



static async updateUser(userId, name, email) {
    try {
        const query = 'UPDATE user SET username = ?, email = ? WHERE user_id = ?';
        await pool.query(query, [name, email, userId]);
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

}

module.exports = UserModel;
