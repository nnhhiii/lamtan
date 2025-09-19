const express = require('express');
const Post = require('../models/Post');
const router = express.Router();
const upload = require('../upload/uploadConfig');
const cloudinary = require('../upload/cloudinaryConfig');

// Lấy danh sách bài viết (có category)
router.get('/', async (req, res) => {
    try {
        const { _sort, _order, _start, _end, q } = req.query;

        let sort = {};
        if (_sort) {
            sort[_sort] = _order === 'DESC' ? -1 : 1;
        }

        const start = parseInt(_start) || 0;
        const end = parseInt(_end) || 10;
        const limit = end - start;

        const query = {};
        if (q) {
            query.name = { $regex: q, $options: 'i' };
        }

        const posts = await Post.find(query)
            .sort(sort)
            .skip(start)
            .limit(limit);

        const totalCount = await Post.countDocuments(query);

        const formattedPosts = posts.map(post => ({
            ...post.toObject(),
            id: post._id,
        }));

        res.set('X-Total-Count', totalCount);
        res.set('Access-Control-Expose-Headers', 'X-Total-Count');
        res.json(formattedPosts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Xem chi tiết bài viết 
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Bài viết không tìm thấy' });
        }

        res.json({
            ...post.toObject(),
            id: post._id,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Xem tất cả theo category id
router.get('/category/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;

        // Tìm danh sách  có category = categoryId
        const posts = await Post.find({ postCategory: categoryId }).populate('postCategory');

        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách sản phẩm', error: err.message });
    }
});

// Tạo mới bài viết 
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.body.postCategory) {
            return res.status(400).json({ message: 'postCategory is required' });
        }

        let imagePath = req.file
            ? req.file.path
            : 'https://res.cloudinary.com/dpuldllty/image/upload/v1736512130/default_tkzvsa.png';

        const post = new Post({
            ...req.body,
            image: imagePath,
        });

        const savedPost = await post.save();

        res.status(201).json({
            id: savedPost._id.toString(),
            ...savedPost.toObject(),
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Cập nhật bài viết 
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        if (!req.body.postCategory) {
            return res.status(400).json({ message: 'postCategory is required' });
        }

        let imagePath = req.body.image;
        if (req.file) {
            imagePath = req.file.path;
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                image: imagePath,
            },
            { new: true }
        );

        res.status(200).json({
            id: updatedPost._id.toString(),
            ...updatedPost.toObject(),
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Xóa bài viết
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'post not found' });
        }

        const defaultImage = 'https://res.cloudinary.com/dpuldllty/image/upload/v1736512130/default_tkzvsa.png';

        if (post.image && post.image !== defaultImage && post.image.includes('https://res.cloudinary.com')) {
            const getPublicId = (url) => {
                const parts = url.split('/');
                const versionIndex = parts.findIndex(part => part.startsWith('v'));
                if (versionIndex === -1) return null;
                return parts.slice(versionIndex + 1).join('/').split('.')[0];
            };

            await cloudinary.uploader.destroy(getPublicId(post.image));
        }

        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'post deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
