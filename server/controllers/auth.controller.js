const User = require('../models/User.model');
const jwt  = require('jsonwebtoken');
const { sendSuccess, sendError } = require('../utils/responseUtils');

const generateToken = (id) => jwt.sign(
  { id },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
);

exports.register = async (req, res, next) => {
  try {
    console.log('Register body received:', req.body);

    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 400, 'Name, email and password are required');
    }

    if (password.length < 8) {
      return sendError(res, 400, 'Password must be at least 8 characters');
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return sendError(res, 409, 'This email is already registered. Please login.');
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone || '',
    });

    const token = generateToken(user._id);

    return sendSuccess(res, 201, 'Registration successful', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        onboardingComplete: user.onboardingComplete || false,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    // Handle MongoDB duplicate key error
    if (err.code === 11000) {
      return sendError(res, 409, 'Email already registered. Please login.');
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    console.log('Login body received:', req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 400, 'Email and password required');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await user.matchPassword(password))) {
      return sendError(res, 401, 'Invalid credentials');
    }

    const token = generateToken(user._id);
    return sendSuccess(res, 200, 'Login successful', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        onboardingComplete: user.onboardingComplete || false,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return sendSuccess(res, 200, 'User fetched', { user });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  return sendSuccess(res, 200, 'Logged out successfully');
};
