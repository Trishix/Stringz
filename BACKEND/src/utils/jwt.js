const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || 'mysecretkey', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

module.exports = { generateToken };