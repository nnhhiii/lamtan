const express = require("express");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const router = express.Router();


// Lấy tất cả đơn hàng (Admin)
router.get('/', async (req, res) => {
    const { status, q, _sort, _order, _start, _end } = req.query;

    let query = {};

    // Lọc theo status nếu có
    if (status) {
        query.orderStatus = status;
    }

    // Tìm kiếm theo _id nếu có
    if (q) {
        query.$expr = {
            $regexMatch: { input: { $toString: '$_id' }, regex: q, options: 'i' },
        };
    }

    // Sort và pagination
    let sortObj = {};
    if (_sort) sortObj[_sort] = _order === 'DESC' ? -1 : 1;

    const start = parseInt(_start) || 0;
    const end = parseInt(_end) || 10;

    const orders = await Order.find(query)
        .sort(sortObj)
        .skip(start)
        .limit(end - start);

    const totalCount = await Order.countDocuments(query);

    res.set('X-Total-Count', totalCount);
    res.set('Access-Control-Expose-Headers', 'X-Total-Count');
    res.json(orders.map(o => ({ ...o.toObject(), id: o._id })));
});



// Lấy tất cả đơn hàng của user (lọc theo status nếu có)
router.get("/user", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Vui lòng đăng nhập!" });
    }

    try {
        const userId = req.session.user._id;
        const { status } = req.query;

        let filter = { user: userId };
        if (status && status !== "all") {
            filter.orderStatus = status;
        }

        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .populate("items.product");

        res.json(
            orders.map((o) => ({
                ...o.toObject(),
                id: o._id,
            }))
        );
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy chi tiết 1 đơn hàng của user
router.get("/user/:id", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Vui lòng đăng nhập!" });
    }

    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.session.user._id  // chỉ lấy order của chính user này
        }).populate('items.product');

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn đặt hàng" });
        }

        res.json({ ...order.toObject(), id: order._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy chi tiết 1 đơn hàng (Admin)
router.get("/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.json({ ...order.toObject(), id: order._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Checkout: Tạo đơn hàng từ giỏ hàng
router.post("/checkout", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Vui lòng đăng nhập!" });
    }

    try {
        const userId = req.session.user._id;
        const shippingAddress = req.session.user.address;
        const phoneNumber = req.session.user.phone;
        if (!phoneNumber || phoneNumber.trim() === "" || !shippingAddress || shippingAddress.trim() === "") {
            return res.status(400).json({ message: "Vui lòng cập nhật đầy đủ thông tin giao hàng trước khi thanh toán." });
        }
        const { selectedItems, totalPrice, paymentMethod, note } = req.body;

        // Tìm giỏ hàng của user
        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Giỏ hàng trống!" });
        }

        const orderItems = [];

        for (const itemId of selectedItems) {
            const cartItem = cart.items.find(i => i._id.toString() === itemId);
            if (!cartItem) continue;

            // Tìm variantData
            let variantData = null;
            if (cartItem.variant && cartItem.product?.variants) {
                variantData = cartItem.product.variants.find(
                    v => v._id.toString() === cartItem.variant.toString()
                );
            }

            // ✅ Update quantitySold theo số lượng mua
            await Product.findByIdAndUpdate(
                cartItem.product._id,
                { $inc: { quantitySold: cartItem.quantity } }  // tăng theo quantity chứ ko chỉ +1
            );

            orderItems.push({
                product: cartItem.product._id,
                variant: variantData
                    ? { name: variantData.name, images: variantData.images || [] }
                    : null,
                quantity: cartItem.quantity,
                price: variantData?.price || cartItem.product.price
            });
        }

        // Tạo đơn hàng mới
        const newOrder = new Order({
            user: userId,
            items: orderItems,
            totalPrice,
            paymentMethod,
            shippingAddress,
            note,
            paymentStatus: "pending",
            orderStatus: "pending",
        });

        await newOrder.save();

        // Xoá các item đã chọn khỏi giỏ
        cart.items = cart.items.filter(i => !selectedItems.includes(i._id.toString()));
        await cart.save();

        res.json({ message: 'Đặt hàng thành công!', newOrder });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Update trạng thái đơn hàng (Admin)
router.put("/:id", async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;

        const updateFields = {};

        // Xử lý paymentStatus
        if (paymentStatus) {
            updateFields.paymentStatus = paymentStatus;

            if (paymentStatus === "paid") {
                updateFields.paidTimestamp = new Date();
            }
            if (paymentStatus === "failed") {
                updateFields.failedTimestamp = new Date();
            }
        }

        // Xử lý orderStatus
        if (orderStatus) {
            updateFields.orderStatus = orderStatus;

            if (orderStatus === "confirmed") {
                updateFields.confirmedTimestamp = new Date();
            }
            if (orderStatus === "shipping") {
                updateFields.shippingTimestamp = new Date();
            }
            if (orderStatus === "delivered") {
                updateFields.deliveredTimestamp = new Date();
            }
            if (orderStatus === "delivered") {
                updateFields.cancelledTimestamp = new Date();
            }
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true }
        ).populate("items.product");

        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

        res.json({
            ...updatedOrder.toObject(),
            id: updatedOrder._id
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Hủy đơn hàng
router.put("/cancelOrder/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("items.product");
        if (!order) return res.status(404).json({ message: "Order not found" });

        // chỉ cho hủy khi còn pending
        if (order.orderStatus !== "pending") {
            return res.status(400).json({ message: "Chỉ được hủy đơn khi đang pending" });
        }

        // Giảm số lượng sold của sản phẩm
        for (const item of order.items) {
            const product = await Product.findById(item.product._id);
            if (product) {
                product.quantitySold = Math.max(0, product.quantitySold - item.quantity); // tránh âm
                await product.save();
            }
        }

        order.orderStatus = "cancelled";
        order.cancelledTimestamp = new Date();
        await order.save();

        res.json(order);
    } catch (err) {
        console.error("Cancel order error:", err);
        res.status(500).json({ message: err.message });
    }
});


// Xoá đơn hàng
// router.delete("/:id", async (req, res) => {
//     try {
//         const deleted = await Order.findByIdAndDelete(req.params.id);
//         if (!deleted) return res.status(404).json({ message: "Order not found" });

//         res.json({ message: "Order deleted successfully" });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

module.exports = router;
