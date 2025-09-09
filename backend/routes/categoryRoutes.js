const express = require('express');
const Category = require('../models/Category');
const router = express.Router();
const upload = require('../uploadConfig');
const cloudinary = require('../cloudinaryConfig');

// Lấy danh sách sản phẩm với phân trang, sắp xếp
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
            query.name = { $regex: q, $options: 'i' };
        }

        const categories = await Category.find(query)
            .sort(sort)
            .skip(start)
            .limit(limit);

        const totalCount = await Category.countDocuments(query); 

        const formattedCategories = categories.map(category => ({
            ...category.toObject(),
            id: category._id,
        }));

        res.set('X-Total-Count', totalCount);
        res.set('Access-Control-Expose-Headers', 'X-Total-Count');
        res.json(formattedCategories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// Xem chi tiết sản phẩm
router.get('/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;

        // Tìm sản phẩm theo id
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
        }

        // Chuyển đổi _id thành id
        const formattedCategory = {
            ...category.toObject(),
            id: category._id, // Thêm trường id
            _id: undefined   // Xóa trường _id nếu không cần thiết
        };

        // Gửi phản hồi
        res.json(formattedCategory);
    } catch (err) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy chi tiết sản phẩm', error: err.message });
    }
});

// Tạo mới sản phẩm
router.post('/', upload.single('image'), async (req, res) => {
    try {
        let imagePath = ''
        if (req.file) {
            imagePath = req.file.path;  // path đã được xử lý bởi Multer + CloudinaryStorage
        } else {
            imagePath = 'https://res.cloudinary.com/dpuldllty/image/upload/v1736512130/default_tkzvsa.png';
        }

        const category = new Category({
            ...req.body,
            image: imagePath,
        });

        const savedCategory = await category.save();
        res.status(201).json({
            id: savedCategory._id.toString(),
            ...savedCategory.toObject(),
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Cập nhật sản phẩm
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        let imagePath = req.body.image; // Lấy URL từ request body

        if (req.file) {
            imagePath = req.file.path; // Đường dẫn ảnh trả về từ Cloudinary
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                image: imagePath, // Cập nhật avatar mới từ Cloudinary
            },
            { new: true }
        );

        res.status(200).json({
            id: updatedCategory._id.toString(),
            ...updatedCategory.toObject(),
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Xóa sản phẩm
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'category not found' });
        }

        const defaultImage = 'https://res.cloudinary.com/dpuldllty/image/upload/v1736512130/default_tkzvsa.png';

        if (category.image && category.image !== defaultImage && category.image.includes('https://res.cloudinary.com')) {
            const getPublicId = (url) => {
                const parts = url.split('/');
                const versionIndex = parts.findIndex(part => part.startsWith('v'));
                if (versionIndex === -1) return null;

                // Lấy tất cả các phần sau `v1234567890` làm public_id
                return parts.slice(versionIndex + 1).join('/').split('.')[0];
            };

            await cloudinary.uploader.destroy(getPublicId(category.image));
        }

        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'category deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
