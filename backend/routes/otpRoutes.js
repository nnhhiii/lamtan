const express = require('express');
const router = express.Router();
const axios = require("axios");

const otpStore = new Map(); // key = phone, value = otp

// Gửi sms (esms)
router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    const response = await axios.post(
      "https://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_post_json/",
      {
        ApiKey: "02C2FE8922074B901A4FD05412B710",
        Content: `${otp} la ma xac minh dang ky Baotrixemay cua ban`,
        Phone: phone,
        SecretKey: "C3B6EFC7D27F9D3AC078343870DBDC",
        //    Brandname: "Baotrixemay",
        SmsType: 1, // 2 nếu có brandname
        RequestId: Date.now().toString(),
        CallbackUrl: "https://esms.vn/webhook/"
      }
    );

    otpStore.set(phone, otp); // lưu OTP tạm (3 phút)
    setTimeout(() => otpStore.delete(phone), 3 * 60 * 1000);

    console.log("send otp: ", otp);
    console.log("SMS Response:", response.data);
    res.json({ success: true, message: "Đã gửi mã OTP" });
  } catch (error) {
    console.error("SMS error:", error);
    res.status(500).json({ success: false, error: "Không gửi được OTP" });
  }
});


// Xác minh OTP
router.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;
  const storedOtp = otpStore.get(phone);

  if (!storedOtp) {
    return res.json({ success: false, error: "OTP hết hạn hoặc chưa gửi" });
  }

  if (storedOtp === otp) {
    otpStore.delete(phone); // xoá luôn để tránh reuse
    return res.json({ success: true, message: "Xác minh thành công" });
  }
  console.log("verify: ", req.body);
  res.json({ success: false, error: "Mã OTP không chính xác!" });
});

module.exports = router;
