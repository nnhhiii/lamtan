const express = require('express');
const router = express.Router();
const crypto = require("crypto");
const axios = require("axios");
const Order = require("../models/Order"); // import model Order

// Tạo thanh toán
router.post("/", async (req, res) => {
    try {
        const { amount, orderId } = req.body;

        const requestId = orderId + new Date().getTime();
        const secretKey = process.env.MOMO_SECRET_KEY;
        const partnerCode = process.env.MOMO_PARTNER_CODE;
        const accessKey = process.env.MOMO_ACCESS_KEY;
        const redirectUrl = `${process.env.FRONTEND_USER_URL}/payment`;
        const ipnUrl = `${process.env.BACKEND_URL}/api/payment/callback`;

        const rawSignature =
            `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}` +
            `&orderId=${orderId}&orderInfo=Thanh toan don hang ${orderId}` +
            `&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}` +
            `&requestId=${requestId}&requestType=captureWallet`;

        const signature = crypto.createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");

        const requestBody = {
            partnerCode,
            accessKey,
            requestId,
            amount,
            orderId,
            orderInfo: `Thanh toan don hang ${orderId}`,
            redirectUrl,
            ipnUrl,
            requestType: "captureWallet",
            extraData: "",
            signature,
            lang: "vi"
        };

        const response = await axios.post("https://test-payment.momo.vn/v2/gateway/api/create", requestBody);

        res.json({ payUrl: response.data.payUrl });
    } catch (err) {
        console.error("Momo create payment error:", err);
        res.status(500).json({ message: "Tạo thanh toán thất bại" });
    }
});

// Callback từ Momo
router.post("/callback", async (req, res) => {
    try {
        const { orderId, resultCode } = req.body;

        if (resultCode === 0) {
            await Order.findOneAndUpdate(
                { _id: orderId },
                { $set: { paymentStatus: "paid", orderStatus: "confirmed" } }
            );
            console.log(`✅ Thanh toán thành công: ${orderId}`);
        } else {
            await Order.findOneAndUpdate(
                { _id: orderId },
                { $set: { paymentStatus: "failed" } }
            );
            console.log(`❌ Thanh toán thất bại: ${orderId}`);
        }

        res.status(200).json({ message: "ok" });
    } catch (err) {
        console.error("Momo callback error:", err);
        res.status(500).json({ message: "Callback xử lý lỗi" });
    }
});

module.exports = router;
