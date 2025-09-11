const express = require('express');
const router = express.Router();
const UserAdmin = require('../models/UserAdmin');
const bcrypt = require('bcryptjs');

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

        const userAdmins = await UserAdmin.find(query)
            .sort(sort)
            .skip(start)
            .limit(limit);

        const totalCount = await UserAdmin.countDocuments(query); 

        const formattedUsers = userAdmins.map(UserAdmin => ({
            ...UserAdmin.toObject(),
            id: UserAdmin._id,
        }));

        res.set('X-Total-Count', totalCount);
        res.set('Access-Control-Expose-Headers', 'X-Total-Count');
        res.json(formattedUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// === LOGIN ===
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserAdmin.findOne({ username });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng!' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Mật khẩu không chính xác!' });

    req.session.userAdmin = {
      id: user._id,
      username: user.username
    };

    res.status(200).json({ message: 'Đăng nhập thành công!', user: req.session.userAdmin });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  delete req.session.userAdmin;
  res.json({ message: 'Đăng xuất thành công!' });
});

// === GET PROFILE (session-based) ===
router.get('/profile', async (req, res) => {
  if (!req.session.userAdmin) return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!' });

  try {
    const user = await UserAdmin.findById(req.session.userAdmin.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    res.json({
      id: user._id,
      username: user.username
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin quản trị viên!', error: err.message });
  }
});

// === CHECK SESSION ===
router.get('/check-session', (req, res) => {
    if (req.session.userAdmin) {
        res.json({ user: req.session.userAdmin });
    } else {
        res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!' });
    }
});

// Xem chi tiết 
router.get('/:id', async (req, res) => {
    try {
        const userAdmin = await UserAdmin.findById(req.params.id);

        if (!userAdmin) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        res.json({
            id: userAdmin._id, // Thêm trường id
            ...userAdmin.toObject(),
        });
    } catch (err) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy chi tiết người dùng', error: err.message });
    }
});

// Tạo người dùng mới
router.post('/', async (req, res) => {
    try {

        // Hash mật khẩu trước khi lưu
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new UserAdmin({
            ...req.body,
            password: hashedPassword, // Lưu mật khẩu đã được hash
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

// Cập nhật UserAdmin
router.put('/:id', async (req, res) => {
    try {

        const updatedUser = await UserAdmin.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                
            },
            { new: true }
        );

        res.status(200).json({
            id: updatedUser._id.toString(),
            ...updatedUser.toObject(),
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Xóa 
router.delete('/:id', async (req, res) => {
    try {
        const userAdmin = await UserAdmin.findById(req.params.id);
        if (!userAdmin) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        await UserAdmin.findByIdAndDelete(req.params.id);
        res.json({ message: 'UserAdmin deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
