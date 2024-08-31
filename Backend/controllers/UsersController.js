const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UsersModel');
const ReviewModel = require('../models/ReviewModel')
const OrderModel = require('../models/OrderModel')
const passport = require('passport');

async function register(req, res) {
    const { username, password, email } = req.body;
    
    try {
        // Check if user already exists
        const existingUser = await UserModel.getUserByUsername(username);
        
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user in database
        const userId = await UserModel.createUser(username, hashedPassword, email);
        
        // Send response
        res.status(200).json({ message: "User created successfully", userId });
         
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: "Failed to register user. Please try again later." });
    }
}
async function login(req, res) {
    const {username, password} = req.body;
    try {
        // Retrieve user from database
        const user = await UserModel.getUserByUsername(username);
         
        // Check if user exists
        if (!user.username) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
       
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Login successful
        res.status(200).json({ token, isAdmin: user.isAdmin }); // Include isAdmin field in the response
    } catch (error) {
        // Error occurred
        console.error('Error logging in:', error);
        res.status(500).json({ message: "Failed to login. Please try again later." });
    }
}

async function changePassword(req, res) {
    const { userId,oldPassword, newPassword } = req.body;
    
    try {
        const isPasswordChanged = await UserModel.changePassword(userId,oldPassword, newPassword);
        if (isPasswordChanged) {
            res.status(200).json({ message: 'Password changed successfully' });
        } else {
            res.status(400).json({ message: 'Old password is incorrect' });
        }
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Error changing password' });
    }
}

// Get User Info
async function getUserInfo(req, res) {
    try {
        const { username, email , user_id, isAdmin} = req.user;

        // Send user information in the response
        res.status(200).json({ username, email, user_id,isAdmin });
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: "Failed to fetch user info" });
    }
}

async function getUsers  (req, res){
    try {
        const users = await UserModel.getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users' });
    }
};

async function fetchUserReview(req,res){
    const {userId} = req.body;
    try {
        const reviews=await ReviewModel.getUserReviews(userId);
        if(!reviews) throw new Error("No Reviews Found");
        res.status(200).json(reviews);
    }catch{
        res.status(404).json({message:"No Reviews found for this user"});
    }
    
}


async function fetchUserOrder(req,res){
    const {userId} = req.body;
    try {
        const order=await OrderModel.getUserOrder(userId);
        if(!order) throw new Error("No Order Found");
        res.status(200).json(order);
    }catch{
        res.status(404).json({message:"No Order found for this user"});
    }
    
}

async function contactUs(req, res) {
  const { name, email, phone, message } = req.body;

  try {
    if (!name || !email || !phone || !message) {
      throw new Error('Please provide all required information');
    }

    // Store Message In Database
    const user = await UserModel.contactUs(name, email, phone, message);
    
    // Send a success response
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error contacting user:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
}

 async function deleteUser(req, res) {
    const {username} = req.body
    try {
        const user = await UserModel.deleteUser(username);  // Proceed to delete the user
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Failed to delete user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
}

async function updateUser(req, res) {
    const { userId, name, email } = req.body;
    try {
        await UserModel.updateUser(userId, name, email);
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
}

module.exports = {
    login,
    register,
    getUserInfo,
    updateUser,
    contactUs,
    fetchUserReview,
    getUsers,
    fetchUserOrder,
    changePassword,
    deleteUser
};
