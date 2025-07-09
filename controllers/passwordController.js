const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// --- Forgot Password ---
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(404).json({ message: 'User not found or not verified' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const plainText = `
Hello ${user.name},

We received a request to reset your password for your DriveEasy account.

To reset your password, click the following link:
${resetUrl}

This link will expire in 1 hour. If you didn’t request this, you can safely ignore this email.

DriveEasy — Making vehicle rentals simple, affordable, and enjoyable.
    `;

    const htmlContent = `
<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
  <h2 style="color: #007BFF;">DriveEasy Password Reset</h2>
  <p>Hi <strong>${user.name}</strong>,</p>
  <p>We received a request to reset your password for your <strong>DriveEasy</strong> account.</p>
  <p>Click the button below to reset your password. This link will expire in <strong>1 hour</strong>.</p>
  <a href="${resetUrl}" style="display: inline-block; margin: 10px 0; padding: 12px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
  <p>If the button doesn't work, copy and paste this link into your browser:</p>
  <p style="word-break: break-word;">${resetUrl}</p>
  <hr>
  <p style="font-size: 12px; color: #888;">
    If you didn’t request a password reset, you can ignore this email.<br>
    © ${new Date().getFullYear()} DriveEasy, All rights reserved.
  </p>
</div>
    `;

    await sendEmail(user.email, 'DriveEasy Password Reset Request', plainText, htmlContent);

    res.json({ message: 'Password reset link sent' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending reset email', error: err.message });
  }
};

// --- Verify Reset Token ---

const verifyResetToken = async (req, res) => {
  const { token } = req.params;
  if (!token) return res.status(400).json({ message: 'Token is required' });

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    res.status(200).json({ message: 'Token verified' });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying token', error: err.message });
  }
};


// --- Reset Password ---
const resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const token = req.params.token;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = newPassword; 
    await user.save();
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    console.log("Updated hashed password:", user.password);

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password', error: err.message });
  }
};

// --- Send Verification Email ---
const sendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.isVerified) return res.status(400).json({ message: 'Already verified' });

  const token = crypto.randomBytes(32).toString('hex');
  user.emailVerificationToken = token;
  user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  await user.save();

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

  const plainText = `
Hi ${user.name},

Welcome to DriveEasy! Please verify your email address by clicking the link below:

${verifyUrl}

This link will expire in 24 hours.

DriveEasy — Making vehicle rentals simple, affordable, and enjoyable.
  `;

  const htmlContent = `
<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
  <h2 style="color: #28a745;">Welcome to DriveEasy!</h2>
  <p>Hi <strong>${user.name}</strong>,</p>
  <p>Thanks for registering with <strong>DriveEasy</strong>. To activate your account, please verify your email address.</p>
  <a href="${verifyUrl}" style="display: inline-block; margin: 10px 0; padding: 12px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
  <hr>
  <p style="font-size: 12px; color: #888;">
    This link expires in 24 hours.<br>
    © ${new Date().getFullYear()} DriveEasy, All rights reserved.
  </p>
</div>
  `;

  await sendEmail(user.email, 'Verify Your DriveEasy Account', plainText, htmlContent);

  res.json({ message: 'Verification email sent' });
};

// --- Verify Email ---
const verifyEmail = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpire: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save();

  res.json({ message: 'Email verified successfully' });
};

module.exports = {
  forgotPassword,
  verifyResetToken,
  resetPassword,
  sendVerificationEmail,
  verifyEmail
};
