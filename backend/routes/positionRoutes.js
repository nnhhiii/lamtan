const express = require('express');
const Position = require('../models/Position');
const router = express.Router();

// Lấy danh sách vị trí (có phân trang, tìm kiếm, sắp xếp)
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
            query.title = { $regex: q, $options: 'i' };
        }

        const positions = await Position.find(query)
            .sort(sort)
            .skip(start)
            .limit(limit);

        const totalCount = await Position.countDocuments(query);

        const formatted = positions.map((pos) => ({
            ...pos.toObject(),
            id: pos._id,
        }));

        res.set('X-Total-Count', totalCount);
        res.set('Access-Control-Expose-Headers', 'X-Total-Count');
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Xem chi tiết vị trí
router.get('/:id', async (req, res) => {
    try {
        const position = await Position.findById(req.params.id);
        if (!position) {
            return res.status(404).json({ message: 'Không tìm thấy vị trí' });
        }
        res.json({ ...position.toObject(), id: position._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Tạo mới vị trí
router.post('/', async (req, res) => {
    try {
        const position = new Position(req.body);
        const saved = await position.save();
        res.status(201).json({ id: saved._id, ...saved.toObject() });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Cập nhật vị trí
router.put('/:id', async (req, res) => {
    try {
        const updated = await Position.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json({ id: updated._id, ...updated.toObject() });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Xóa vị trí
router.delete('/:id', async (req, res) => {
    try {
        await Position.findByIdAndDelete(req.params.id);
        res.json({ message: 'Xóa vị trí thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
