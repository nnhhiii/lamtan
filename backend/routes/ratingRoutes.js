const express = require('express');
const Rating = require('../models/Rating');
const Product = require('../models/Product');
const Order = require('../models/Order');
const router = express.Router();
const upload = require('../uploadConfig');
const cloudinary = require('../cloudinaryConfig');

// Lấy danh sách đánh giá với phân trang, sắp xếp
router.get('/', async (req, res) => {
    try {
        const { _sort, _order, _start, _end, product } = req.query;

        // Sắp xếp
        let sort = {};
        if (_sort) {
            sort[_sort] = _order === 'DESC' ? -1 : 1;
        }

        // Phân trang
        const start = parseInt(_start) || 0;
        const end = parseInt(_end) || 10;
        const limit = end - start;

        // Lọc
        const query = {};

        // Lọc theo sản phẩm (dropdown)
        if (product) {
            query.product = product;
        }

        const ratings = await Rating.find(query)
            .sort(sort)
            .skip(start)
            .limit(limit)

        const totalCount = await Rating.countDocuments(query);

        const formattedRatings = ratings.map(rating => ({
            ...rating.toObject(),
            id: rating._id,
        }));

        res.set('X-Total-Count', totalCount);
        res.set('Access-Control-Expose-Headers', 'X-Total-Count');
        res.json(formattedRatings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});



// Xem chi tiết đánh giá
router.get('/:id', async (req, res) => {
    try {
        const ratingId = req.params.id;

        // Tìm đánh giá theo id
        const rating = await Rating.findById(ratingId);

        if (!rating) {
            return res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
        }

        // Chuyển đổi _id thành id
        const formattedRating = {
            ...rating.toObject(),
            id: rating._id, // Thêm trường id
            _id: undefined   // Xóa trường _id nếu không cần thiết
        };

        // Gửi phản hồi
        res.json(formattedRating);
    } catch (err) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy chi tiết đánh giá', error: err.message });
    }
});

// Lấy tất cả đánh giá của sản phẩm
router.get('/product/:id', async (req, res) => {
    try {
        const ratings = await Rating.find({ product: req.params.id })
            .populate('user', 'username image')
            .sort({ createdAt: -1 });

        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Tạo mới đánh giá
router.post('/', upload.any(), async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const userId = req.session.user._id;
        const { product, order } = req.body;
        // 1. Kiểm tra đơn hàng có tồn tại và thuộc về user không
        const foundOrder = await Order.findOne({ _id: order, user: userId }).populate("items.product");
        if (!foundOrder) {
            return res.status(400).json({ message: 'Đơn hàng không thuộc về người dùng này' });
        }

        // 2. Kiểm tra product có trong đơn hàng hay không
        const productInOrder = foundOrder.items.some(i => i.product._id.toString() === product);
        if (!productInOrder) {
            return res.status(400).json({ message: 'Sản phẩm không có trong đơn hàng này' });
        }

        // 3. Kiểm tra trùng đánh giá (user + product + order)
        const existing = await Rating.findOne({ product, user: userId, order });
        if (existing) {
            return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi' });
        }

        // 4. Lưu ảnh upload (nếu có)
        const files = req.files || [];
        const ratingImages = files
            .filter(f => f.fieldname === 'images')
            .map(f => f.path);

        const images = ratingImages.length > 0 ? ratingImages : null;

        // 5. Tạo rating
        const rating = new Rating({
            ...req.body,
            user: userId,
            images
        });
        const savedRating = await rating.save();

        // 6. Cập nhật averageRating và totalRatings cho Product
        const ratings = await Rating.find({ product });
        const totalRatings = ratings.length;
        const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

        await Product.findByIdAndUpdate(product, {
            averageRating,
            totalRatings
        });

        // 7. Update isReviewed trong Order
        await Order.findByIdAndUpdate(order, { isReviewed: true });

        res.status(201).json({
            id: savedRating._id.toString(),
            ...savedRating.toObject(),
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Cập nhật đánh giá
router.put('/:id', upload.any(), async (req, res) => {
    try {
        const files = req.files || [];

        const existingImages = JSON.parse(req.body.existingImages || '[]');
        const newRatingImages = files
            .filter(f => f.fieldname === 'newImages')
            .map(f => f.path);

        const updatedImages = [...existingImages, ...newRatingImages];

        const updatedRating = await Rating.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                images: updatedImages
            },
            { new: true }
        );
        // Cập nhật averageRating và totalRatings cho Product
        const ratings = await Rating.find({ product: req.body.product });
        const totalRatings = ratings.length;
        const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

        await Product.findByIdAndUpdate(req.body.product, {
            averageRating,
            totalRatings
        });

        res.status(200).json(updatedRating);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});



// Xóa đánh giá
router.delete('/:id', async (req, res) => {
    try {
        const rating = await Rating.findById(req.params.id);
        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        if (rating.images && rating.images.length > 0) {
            const getPublicId = (url) => {
                const parts = url.split('/');
                const versionIndex = parts.findIndex((part) => part.startsWith('v'));
                if (versionIndex === -1) return null;

                return parts.slice(versionIndex + 1).join('/').split('.')[0];
            };

            for (const imgUrl of rating.images) {
                if (imgUrl.includes('https://res.cloudinary.com')) {
                    const publicId = getPublicId(imgUrl);
                    if (publicId) {
                        await cloudinary.uploader.destroy(publicId);
                    }
                }
            }
        }
        await Rating.findByIdAndDelete(req.params.id);
        res.json({ message: 'Rating deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
