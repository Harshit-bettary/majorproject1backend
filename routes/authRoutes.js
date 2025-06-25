const express = require('express');
const {
  registerUser,
  loginUser
} = require('../controllers/authController.js');
const {
  forgotPassword,
  verifyResetToken,
  resetPassword,
  sendVerificationEmail,
  verifyEmail
}=require('../controllers/passwordController.js')
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

// Auth routes
router.post('/register', registerUser);                 // Register a new user
router.post('/login', loginUser);                       // Login with email & password

// Password Reset Flow
router.post('/forgot-password', forgotPassword);        // Send reset password link
router.post('/reset-password/:token', resetPassword);   // Reset password using token
router.get('/verify-reset-token/:token', verifyResetToken); // Check token validity


// Email Verification Flow
router.post('/send-verification', sendVerificationEmail);   // Re-send verification email
router.get('/verify-email/:token', verifyEmail);            // Verify email with token

module.exports = router;
