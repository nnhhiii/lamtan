const express = require('express');
const About = require('../models/About');
const router = express.Router();
const upload = require('../upload/uploadConfig');
const cloudinary = require('../upload/cloudinaryConfig');

// ✅ Lấy thông tin About (chỉ 1 record, vì About thường là thông tin giới thiệu công ty)
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

        const abouts = await About.find(query)
            .sort(sort)
            .skip(start)
            .limit(limit);

        const totalCount = await About.countDocuments(query); 

        const formattedCategories = abouts.map(about => ({
            ...about.toObject(),
            id: about._id,
        }));

        res.set('X-Total-Count', totalCount);
        res.set('Access-Control-Expose-Headers', 'X-Total-Count');
        res.json(formattedCategories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});


// ✅ Xem chi tiết About theo id
router.get('/:id', async (req, res) => {
    try {
        const about = await About.findById(req.params.id);
        if (!about) {
            return res.status(404).json({ message: 'About info not found' });
        }
        res.json({ id: about._id, ...about.toObject() });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Tạo mới About
router.post('/', upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'bannerSideLeftBar', maxCount: 1 }
]), async (req, res) => {
    try {
        let logoPath = req.body.logo || 'https://res.cloudinary.com/dpuldllty/image/upload/v1736512130/default_tkzvsa.png';
        let bannerPath = req.body.bannerSideLeftBar || 'https://res.cloudinary.com/dpuldllty/image/upload/v1736512130/default_tkzvsa.png';

        if (req.files['logo']) {
            logoPath = req.files['logo'][0].path;
        }
        if (req.files['bannerSideLeftBar']) {
            bannerPath = req.files['bannerSideLeftBar'][0].path;
        }

        const about = new About({
            ...req.body,
            logo: logoPath,
            bannerSideLeftBar: bannerPath,
        });

        const savedAbout = await about.save();
        res.status(201).json({ id: savedAbout._id, ...savedAbout.toObject() });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ Cập nhật About
router.put('/:id', upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'bannerSideLeftBar', maxCount: 1 }
]), async (req, res) => {
    try {
        let logoPath = req.body.logo;
        let bannerPath = req.body.bannerSideLeftBar;

        if (req.files['logo']) {
            logoPath = req.files['logo'][0].path;
        }
        if (req.files['bannerSideLeftBar']) {
            bannerPath = req.files['bannerSideLeftBar'][0].path;
        }

        const updatedAbout = await About.findByIdAndUpdate(
            req.params.id,
            { ...req.body, logo: logoPath, bannerSideLeftBar: bannerPath },
            { new: true }
        );

        if (!updatedAbout) {
            return res.status(404).json({ message: 'About not found' });
        }

        res.json({ id: updatedAbout._id, ...updatedAbout.toObject() });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ Xóa About
router.delete('/:id', async (req, res) => {
    try {
        await About.findByIdAndDelete(req.params.id);
        res.json({ message: 'About deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
