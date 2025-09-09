const express = require("express");
const router = express.Router();
const Promotion = require("../models/Promotion");

// ========== LẤY DANH SÁCH PROMOTIONS ==========
router.get("/", async (req, res) => {
  try {
    const { _sort, _order, _start, _end, q } = req.query;

    // Sắp xếp
    let sort = {};
    if (_sort) {
      sort[_sort] = _order === "DESC" ? -1 : 1;
    }

    // Phân trang
    const start = parseInt(_start) || 0;
    const end = parseInt(_end) || 10;
    const limit = end - start;

    // Tìm kiếm
    const query = {};
    if (q) {
      query.$or = [
        { code: { $regex: q, $options: "i" } },
        { title: { $regex: q, $options: "i" } },
      ];
    }

    const promotions = await Promotion.find(query)
      .sort(sort)
      .skip(start)
      .limit(limit);

    const totalCount = await Promotion.countDocuments(query);

    res.set("X-Total-Count", totalCount);
    res.set("Access-Control-Expose-Headers", "X-Total-Count");

    res.json(
      promotions.map((promo) => ({
        id: promo._id,
        ...promo.toObject(),
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ========== LẤY CHI TIẾT ==========
router.get("/:id", async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);

    if (!promotion) {
      return res.status(404).json({ message: "Không tìm thấy khuyến mãi" });
    }

    res.json({
      id: promotion._id,
      ...promotion.toObject(),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi lấy chi tiết promotion", error: err.message });
  }
});

// ========== TẠO MỚI ==========
router.post("/", async (req, res) => {
  try {
    const { tiers } = req.body;

    if (!tiers || !Array.isArray(tiers) || tiers.length === 0) {
      return res.status(400).json({ message: "Promotion phải có ít nhất 1 tier" });
    }

    const promotion = new Promotion({
      ...req.body,
    });

    const savedPromotion = await promotion.save();

    res.status(201).json({
      id: savedPromotion._id.toString(),
      ...savedPromotion.toObject(),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ========== CẬP NHẬT ==========
router.put("/:id", async (req, res) => {
  try {
    if (req.body.tiers && (!Array.isArray(req.body.tiers) || req.body.tiers.length === 0)) {
      return res.status(400).json({ message: "Promotion phải có ít nhất 1 tier" });
    }

    const updatedPromotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    if (!updatedPromotion) {
      return res.status(404).json({ message: "Promotion không tồn tại" });
    }

    res.status(200).json({
      id: updatedPromotion._id.toString(),
      ...updatedPromotion.toObject(),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ========== XÓA ==========
router.delete("/:id", async (req, res) => {
  try {
    const deletedPromotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!deletedPromotion) {
      return res.status(404).json({ message: "Promotion không tồn tại" });
    }
    res.json({ message: "Đã xóa promotion thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
