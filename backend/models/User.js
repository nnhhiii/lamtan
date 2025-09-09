const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        // Với đăng ký bằng tài khoản riêng
        password: {
            type: String,
        },
        // Với Google OAuth
        googleId: { 
            type: String 
        },
        phone: {
            type: String,
        },
        address: {
            type: String,
        },
        addressDetail: {
            type: String,
        },
        image: {
            type: String,
        },
        resetToken: {
            type: String,
        },
    },
    { timestamps: true } // Tự động thêm createdAt và updatedAt
);

const User = mongoose.model('User', userSchema);

module.exports = User;
