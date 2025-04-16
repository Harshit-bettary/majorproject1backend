const bcrypt = require('bcrypt');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail'); 


const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
        
    const resetToken = Math.random().toString(36).substring(2, 15) + Date.now().toString(36); // Creating a random string

    const saltRounds = 10; 
    const hashedResetToken = await bcrypt.hash(resetToken, saltRounds);

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpire = Date.now() + 3600000; 
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail(user.email, 'Password Reset Request', `Click this link to reset your password: ${resetUrl}`);

    res.json({ message: 'Password reset link sent' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending reset email', error: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password', error: err.message });
  }
};
module.exports ={
  forgotPassword,
  resetPassword
};
