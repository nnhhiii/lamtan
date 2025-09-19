const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const session = require('express-session');
const passport = require('passport');

const allowedOrigins = [
  process.env.FRONTEND_USER_URL,
  process.env.FRONTEND_ADMIN_URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.GOOGLE_CLIENT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // để true nếu dùng HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 1 ngày
  }
}));
app.use(passport.initialize());
app.use(passport.session());

require('./passport.js'); // cấu hình passport riêng

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.log(err));

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/carts', require('./routes/cartRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/partners', require('./routes/partnerRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/postCategories', require('./routes/postCategoryRoutes'));
app.use('/api/ratings', require('./routes/ratingRoutes'));
app.use('/api/promotions', require('./routes/promotionRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/otp', require('./routes/otpRoutes'));
app.use('/api/positions', require('./routes/positionRoutes'));
app.use('/api/recruits', require('./routes/recruitRoutes'));
app.use('/api/about', require('./routes/aboutRoutes'));

app.use((req, res, next) => {
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');
  next();
});

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});

//=======TINOHOST=====
// ❌ Không dùng app.listen nữa
// app.listen(process.env.PORT, '0.0.0.0', () => {
//   console.log(`🚀 Server running on port ${process.env.PORT}`);
// });

// ✅ Export app để Passenger tự chạy
// module.exports = app;