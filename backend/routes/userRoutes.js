const express = require('express');
const router = express.Router();
const User = require('../models/User');
const cloudinary = require('../upload/cloudinaryConfig'); // Import cấu hình Cloudinary
const upload = require('../upload/uploadConfig'); // Import cấu hình Multer
const bcrypt = require('bcryptjs');
const checkToken = require('../checkToken');
require('dotenv').config();

// Lấy danh sách tất cả người dùng
router.get('/', async (req, res) => {
    try {
        const { _sort, _order, _start, _end, q } = req.query;

        // Sắp xếp
        let sort = {};
        if (_sort) {
            sort[_sort] = _order === 'DESC' ? -1 : 1;
        }

        // Phân trang
        const start = parseInt(_start) || 0;
        const end = parseInt(_end) || 10;
        const limit = end - start;

        // Tìm kiếm
        const query = {};
        if (q) {
            query.username = { $regex: q, $options: 'i' };
        }

        const users = await User.find(query)
            .sort(sort)
            .skip(start)
            .limit(limit);

        const totalCount = await User.countDocuments(query); 

        const formattedUsers = users.map(user => ({
            ...user.toObject(),
            id: user._id,
        }));

        res.set('X-Total-Count', totalCount);
        res.set('Access-Control-Expose-Headers', 'X-Total-Count');
        res.json(formattedUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// Xem chi tiết 
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy' });
        }

        res.json({
            id: user._id, // Thêm trường id
            ...user.toObject(),
        });
    } catch (err) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy chi tiết người dùng', error: err.message });
    }
});

// Tạo người dùng mới
router.post('/', upload.single('image'), async (req, res) => {
    try {
        let imagePath = ''
        if (req.file) {
            imagePath = req.file.path;  // path đã được xử lý bởi Multer + CloudinaryStorage
        } else {
            imagePath = 'https://res.cloudinary.com/dpuldllty/image/upload/v1733470087/default-user_pb93s4.webp';
        }

        // Hash mật khẩu trước khi lưu
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            ...req.body,
            password: hashedPassword, // Lưu mật khẩu đã được hash
            image: imagePath,       // Lưu URL ảnh
        });

        const savedUser = await user.save();
        res.status(201).json({
            id: savedUser._id.toString(),
            ...savedUser.toObject(),
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Cập nhật user
router.patch('/', checkToken, upload.single('image'), async (req, res) => {
    try {
        let imagePath = req.body.image; // Lấy URL từ request body

        if (req.file) {
            imagePath = req.file.path; // Đường dẫn ảnh trả về từ Cloudinary
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                ...req.body,
                image: imagePath, // Cập nhật image mới từ Cloudinary
            },
            { new: true }
        );

        res.status(200).json({
            id: updatedUser._id.toString(),
            ...updatedUser.toObject(),
            message: 'Cập nhật thành công!'
        });
    } catch (err) {
        res.status(400).json({ message: 'Có lỗi xảy ra khi cập nhật chi tiết người dùng', error: err.message });
    }
});
module.exports = router;
