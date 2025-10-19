// authController.js
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { AppError, catchAsync } from '../middleware/errorHandler.js';

// Generate JWT Token
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });

  // Don't set cookies since client is using localStorage
  // Just return the token for the client to store
  return token;
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = catchAsync(async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    console.log(req.body);

    // Enhanced validation
    const errors = [];

    if (!username || username.trim().length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Please provide a valid email address');
    }

    if (!password || password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (!role || !['admin', 'buyer', 'vendor'].includes(role)) {
      errors.push('Please select a valid role');
    }

    if (errors.length > 0) {
      return next(new AppError('Validation failed', 400));
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    });

    if (existingUser) {
      return next(new AppError(
        existingUser.email === email.toLowerCase()
          ? 'Email already in use'
          : 'Username already taken',
        400
      ));
    }

    // Create user with normalized data
    const user = new User({
      username: username.trim().toLowerCase(),
      email: email.toLowerCase().trim(),
      password,
      role
    });

    await user.save();

    // Generate token and send response
    const token = generateToken(res, user._id);
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      token,
      user: userResponse,
      message: 'Registration successful'
    });

  } catch (err) {
    // Let the global error handler deal with it
    next(err);
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = catchAsync(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Enhanced validation
    if (!email || !password) {
      return next(new AppError('Email and password are required', 400));
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return next(new AppError('Please provide a valid email address', 400));
    }

    // Check for user (case insensitive email search)
    const user = await User.findOne({
      email: email.toLowerCase().trim()
    }).select('+password');

    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Check if user account is active
    if (user.status !== 'active') {
      return next(new AppError('Account is suspended. Please contact support.', 401));
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Update last login timestamp (optional)
    user.lastLogin = new Date();
    await user.save();

    // Generate token and send response
    const token = generateToken(res, user._id);
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.lastLogin; // Don't send lastLogin in response

    res.json({
      success: true,
      token,
      user: userResponse,
      message: 'Login successful'
    });

  } catch (err) {
    next(err);
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if username or email already exists (excluding current user)
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Username already taken'
        });
      }
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email already in use'
        });
      }
    }

    // Update basic fields
    if (username) user.username = username;
    if (email) user.email = email;

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          error: 'Current password is required to change password'
        });
      }

      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          error: 'Current password is incorrect'
        });
      }

      user.password = newPassword;
    }

    await user.save();

    // Send response without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userResponse
    });

  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Profile update failed'
    });
  }
};