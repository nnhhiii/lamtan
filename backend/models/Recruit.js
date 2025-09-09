// models/Recruit.js
const mongoose = require('mongoose');

const recruitSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Vui lòng nhập họ tên'],
            trim: true,
            maxlength: 150,
        },
        phone: {
            type: String,
            required: [true, 'Vui lòng nhập số điện thoại'],
            trim: true,
            // Regex cơ bản cho số ĐT (10-11 số). Tùy ý siết chặt hơn cho VN nếu cần.
            match: [/^\+?\d{9,15}$/, 'Số điện thoại không hợp lệ'],
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, 'Vui lòng nhập email'],
        },
        position: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Position',
            required: true,
        },
        cvUrl: {
            type: String,
            default: '',
            trim: true,
        },
        message: {
            type: String, // Thư giới thiệu / mô tả
            default: '',
        },
        status: {
            type: String,
            enum: ['new', 'reviewing', 'interview', 'offer', 'hired', 'rejected'],
            default: 'new',
        },
        note: {
            type: String, // ghi chú nội bộ của HR
            default: '',
        },
        consent: {
            type: Boolean, // đồng ý xử lý dữ liệu cá nhân, Trong luật về bảo mật dữ liệu cá nhân (đặc biệt ở EU có GDPR, ở VN cũng có nghị định mới), bạn bắt buộc phải có sự đồng ý này trước khi lưu trữ và xử lý thông tin ứng viên
            default: false,
        },
    },
    { timestamps: true }
);

const Recruit = mongoose.model('Recruit', recruitSchema);

module.exports = Recruit;
