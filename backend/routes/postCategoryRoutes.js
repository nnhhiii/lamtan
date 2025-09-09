const express = require('express');
const PostCategory = require('../models/PostCategory');
const router = express.Router();

// Lấy danh sách category
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

        const posts = await PostCategory.find(query)
            .sort(sort)
            .skip(start)
            .limit(limit);

        const totalCount = await PostCategory.countDocuments(query);

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

// Lấy chi tiết category
router.get('/:id', async (req, res) => {
  try {
    const category = await PostCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ ...category.toObject(), id: category._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo mới category
router.post('/', async (req, res) => {
  try {
    const category = new PostCategory(req.body);
    const saved = await category.save();
    res.status(201).json({ ...saved.toObject(), id: saved._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Cập nhật category
router.put('/:id', async (req, res) => {
  try {
    const updated = await PostCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ ...updated.toObject(), id: updated._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa category
router.delete('/:id', async (req, res) => {
  try {
    await PostCategory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
