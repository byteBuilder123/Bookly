// constantsMiddleware.js
const { constants } = require('../constants/constants');

const constantsMiddleware = (req, res, next) => {
  res.locals.constants = constants;
  next();
};

module.exports = constantsMiddleware;
