const jwt = require('jsonwebtoken');
const User = require('../models/User');
const errorResponse = require('../utils/errorResponse');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, 'Email and password are required');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return errorResponse(res, 500, 'Something went wrong. Please try again.');
  }
};

module.exports = { loginUser };
