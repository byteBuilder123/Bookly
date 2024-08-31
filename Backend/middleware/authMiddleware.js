const jwt = require('jsonwebtoken');
const UserModel = require('../models/UsersModel');

async function authMiddleware(req, res, next) {
  // Check if the authorization header is present
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Split the authorization header (handle edge case of extra spaces)
  const parts = req.headers.authorization.trim().split(/\s+/);

  // Check the format of the header
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({ message: "Unauthorized: Invalid token format" });
  }

  const token = parts[1];
  function isTokenValid(token) {
  try {
    // Decode the JWT token (assuming JWT format)
    const decoded = JSON.parse(atob(token.split('.')[1]));

    // Check if expiry time (exp) exists and is valid (informational only)
    if (decoded.exp && Date.now() / 1000 < decoded.exp) {
      console.log('Token not expired (for informational purposes only)');
    } else {
      console.log('Token is expired (or could be revoked) - server-side verification recommended');
    }

    // Extract userId (assuming userId exists in the payload)
    const userId = decoded.userId;
    if (userId) {
      return { isValid: true, userId }; // Return both validity and userId
    } else {
      return { isValid: false, message: 'Token does not contain userId' };
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    return { isValid: false, message: 'Invalid token' };
  }
  
}

const result = isTokenValid(token);

if (result.isValid) {
    const user = await UserModel.getUserById(result.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Attach user information to request object for later use
    req.user = user;
    next();
  
} else {
  console.log('Error:', result.message);
}

}

module.exports = authMiddleware;
