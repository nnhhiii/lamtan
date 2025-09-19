const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            variant: {
                name: { type: String },
                images: [{ type: String }],
            },
            quantity: { type: Number, default: 1 },
            price: { type: Number, required: true },
        },
    ],
    totalPrice: { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: ["cash_on_delivery", "bank_transfer_qr"],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    orderStatus: {
        type: String,
        enum: ["pending", "confirmed", "shipping", "delivered", "cancelled"],
        default: "pending"
    },

    // Các mốc thời gian theo trạng thái
    paidTimestamp: { type: Date },
    failedTimestamp: { type: Date },
    confirmedTimestamp: { type: Date },
    shippingTimestamp: { type: Date },
    deliveredTimestamp: { type: Date },
    cancelledTimestamp: { type: Date },

    shippingAddress: { type: String, required: true },
    shippingAddressDetail: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    note: { type: String },
    isReviewed: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
