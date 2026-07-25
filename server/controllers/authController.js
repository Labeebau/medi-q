const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-Memory Users Store for demo fallback
const memoryUsers = [];

const generateToken = (id, name, email) => {
  return jwt.sign(
    { id, name, email },
    process.env.JWT_SECRET || 'mediq_secret_key_2026_college_project',
    { expiresIn: '7d' }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, phone, password',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 1. If MongoDB is Connected
    if (global.isMongoConnected) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword,
      });

      const token = generateToken(user._id, user.name, user.email);
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { _id: user._id, name: user.name, email: user.email, phone: user.phone, token },
      });
    }

    // 2. Fallback In-Memory Storage
    const existingMemoryUser = memoryUsers.find((u) => u.email === email.toLowerCase());
    if (existingMemoryUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const newId = `user_${Date.now()}`;
    const newUser = { _id: newId, name, email: email.toLowerCase(), phone, password: hashedPassword };
    memoryUsers.push(newUser);

    const token = generateToken(newId, name, email);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully (In-Memory)',
      data: { _id: newId, name, email: email.toLowerCase(), phone, token },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    // 1. If MongoDB is Connected
    if (global.isMongoConnected) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = generateToken(user._id, user.name, user.email);
        return res.status(200).json({
          success: true,
          message: 'Login successful',
          data: { _id: user._id, name: user.name, email: user.email, phone: user.phone, token },
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    }

    // 2. Fallback In-Memory Storage
    const memoryUser = memoryUsers.find((u) => u.email === email.toLowerCase());
    if (memoryUser && (await bcrypt.compare(password, memoryUser.password))) {
      const token = generateToken(memoryUser._id, memoryUser.name, memoryUser.email);
      return res.status(200).json({
        success: true,
        message: 'Login successful (In-Memory)',
        data: {
          _id: memoryUser._id,
          name: memoryUser.name,
          email: memoryUser.email,
          phone: memoryUser.phone,
          token,
        },
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser };
