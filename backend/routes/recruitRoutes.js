const express = require('express');
const Recruit = require('../models/Recruit');
const router = express.Router();
const multer = require("multer");
const uploadToSupabase = require("../uploadSupabase");
const upload = multer({ storage: multer.memoryStorage() }); // lưu file trong RAM

// Lấy danh sách ứng viên (phân trang, tìm kiếm theo tên/email)
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
            query.$or = [
                { fullName: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } }
            ];
        }

        const recruits = await Recruit.find(query)
            .sort(sort)
            .skip(start)
            .limit(limit);

        const totalCount = await Recruit.countDocuments(query);

        const formatted = recruits.map((r) => ({
            ...r.toObject(),
            id: r._id,
        }));

        res.set('X-Total-Count', totalCount);
        res.set('Access-Control-Expose-Headers', 'X-Total-Count');
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Xem chi tiết ứng viên
router.get('/:id', async (req, res) => {
    try {
        const recruit = await Recruit.findById(req.params.id);
        if (!recruit) {
            return res.status(404).json({ message: 'Không tìm thấy ứng viên' });
        }
        res.json({ ...recruit.toObject(), id: recruit._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Tạo mới ứng viên
router.post("/", upload.single("cvUrl"), async (req, res) => {
    try {
        const file = req.file;
        const fileUrl = file ? await uploadToSupabase(file, "uploads") : "";

        const recruit = new Recruit({
            ...req.body,
            cvUrl: fileUrl,
        });

        const saved = await recruit.save();
        res.status(201).json({ 
            id: saved._id, 
            ...saved.toObject(),
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Cập nhật ứng viên
router.put('/:id', upload.single("cvUrl"), async (req, res) => {
    try {
        let fileUrl = req.body.cvUrl; // Lấy URL từ request body

        const file = req.file;
        if (file) {
            fileUrl = await uploadToSupabase(file, "uploads");
        }

        const updated = await Recruit.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                cvUrl: fileUrl,
            },
            { new: true }
        );
        res.json({ id: updated._id, ...updated.toObject() });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Xóa ứng viên
router.delete('/:id', async (req, res) => {
    try {
        await Recruit.findByIdAndDelete(req.params.id);
        res.json({ message: 'Xóa ứng viên thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
