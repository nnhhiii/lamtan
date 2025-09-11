const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const passport = require('passport');
require('dotenv').config();

// === GOOGLE LOGIN ===
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.user = req.user;
    req.session.save(() => {
      res.redirect(process.env.FRONTEND_URL);
    });
  }
);

// === REGISTER ===
router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Đăng ký tài khoản thành công!' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// === LOGIN ===
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng, Email không chính xác!' });
    if (!user.password) return res.status(400).json({ message: 'Tài khoản này dùng Google. Hãy chọn Đăng nhập bằng Google.' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Mật khẩu không chính xác!' });

    req.session.user = user;

    res.status(200).json({ message: 'Đăng nhập thành công!', user: req.session.user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// === LOGOUT ===
router.post('/logout', (req, res) => {
  delete req.session.user;
  res.json({ message: 'Đăng xuất thành công!' });
});

// === GET PROFILE (session-based) ===
router.get('/profile', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({user});
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// === FORGOT PASSWORD ===
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng! Email không đúng!' });

    const resetToken = Math.random().toString(36).substring(2);
    user.resetToken = resetToken;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      html: `<p>Nhấn <a href="${resetLink}">ở đây</a> để đặt lại mật khẩu mới của bạn.</p>`,
    });

    res.json({ message: 'Đã gửi link qua email đặt lại mật khẩu. Hãy kiểm tra email.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

// === RESET PASSWORD ===
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({ resetToken: token, updatedAt: { $gt: Date.now() - 60 * 60 * 1000 }});
    if (!user) return res.status(404).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = '';
    user.updatedAt = '';
    await user.save();

    res.json({ message: 'Đổi mật khẩu thành công!' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;