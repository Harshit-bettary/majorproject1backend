const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const generateToken = require('../utils/generateToken');


const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const newUser = new User({
      name,
      email,
      password,
      isVerified: false,
      emailVerificationToken,
      emailVerificationExpire
    });

    await newUser.save();

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${emailVerificationToken}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Welcome to DriveEasy, ${name}!</h2>
        <p>Please verify your email by clicking the button below:</p>
        <a href="${verificationUrl}" style="background: #28a745; padding: 10px 20px; color: white; text-decoration: none; border-radius: 4px;">Verify Email</a>
      </div>
    `;

    await sendEmail(
      newUser.email,
      'Verify Your DriveEasy Account',
      'Please verify your email using the link provided.',
      htmlContent
    );

    res.status(201).json({
      message: 'User registered successfully. Verification email sent.'
    });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};


const loginUser = async (req, res) => {
  try {
    
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isMatch = await user.matchPassword(password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!isMatch) 
      return res.status(400).json({ message: 'Invalid email or password' });
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email before logging in' });
    }
    if (!(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// const forgotPassword = async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: 'No user found with this email' });
//     }

//     const resetToken = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
//     await user.save();

//     const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
//     try {
//       await sendEmail({
//         to: user.email,
//         subject: 'DriveEasy Password Reset Request',
//         html: `
//           <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
//             <h2 style="color: #4f46e5;">Reset Your DriveEasy Password</h2>
//             <p>Click the link below to reset your account password:</p>
//             <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #4f46e5; border-radius: 8px; text-decoration: none;">Reset Password</a>
//             <p style="margin-top: 20px;">This link expires in 1 hour.</p>
//             <p>If you didn’t request this, please ignore this email.</p>
//             <p style="color: #6b7280;">&copy; 2025 DriveEasy</p>
//           </div>
//         `,
//       });
//     } catch (emailErr) {
//       user.resetPasswordToken = undefined;
//       user.resetPasswordExpire = undefined;
//       await user.save();
//       return res.status(500).json({ message: 'Failed to send reset email' });
//     }

//     res.status(200).json({ message: 'Password reset link sent to your email' });
//   } catch (err) {
//     console.error('Forgot password error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const resetPassword = async (req, res) => {
//   const { token } = req.params;
//   const { password } = req.body;

//   try {
//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (err) {
//       return res.status(400).json({ message: 'Invalid or expired reset token' });
//     }

//     const user = await User.findOne({
//       _id: decoded.userId,
//       resetPasswordToken: token,
//       resetPasswordExpire: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid or expired reset token' });
//     }

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
//     await user.save();

//     res.status(200).json({ message: 'Password reset successful' });
//   } catch (err) {
//     console.error('Reset password error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const verifyResetToken = async (req, res) => {
//   const { token } = req.params;

//   try {
//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (err) {
//       return res.status(400).json({ message: 'Invalid or expired reset token' });
//     }

//     const user = await User.findOne({
//       _id: decoded.userId,
//       resetPasswordToken: token,
//       resetPasswordExpire: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid or expired reset token' });
//     }

//     res.status(200).json({ message: 'Token is valid' });
//   } catch (err) {
//     console.error('Verify token error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

module.exports = {
  registerUser,
  loginUser,
  getProfile
};
  //forgotPassword,
  // resetPassword,
  // verifyResetToken,