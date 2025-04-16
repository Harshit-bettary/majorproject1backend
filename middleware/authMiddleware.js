const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  console.log('Authorization header:', req.headers.authorization);

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  console.log('Extracted token:', token);

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    console.log('Verifying token with JWT_SECRET:', process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    req.user = await User.findById(decoded.id).select('-password');
    console.log('User from DB:', req.user);

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminOnly = async (req, res, next) => {
  try {
    console.log('Checking admin role, user:', req.user);
    if (req.user && req.user.role.toLowerCase() === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Admin access required' });
    }
  } catch (err) {
    console.error('Admin middleware error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { protect, adminOnly };