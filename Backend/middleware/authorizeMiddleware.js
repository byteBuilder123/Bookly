// authorizeMiddleware.js

function authorizeMiddleware(allowedRoles) {
    return (req, res, next) => {
      const userRoles = req.user.roles;
  
      if (!userRoles || !userRoles.some(role => allowedRoles.includes(role))) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }
  
      next();
    };
  }
  
  module.exports = authorizeMiddleware;
  