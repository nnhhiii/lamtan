const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', // Liên kết với Product
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Liên kết với User
            required: true,
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order', // Liên kết với Order
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5, // Điểm đánh giá từ 1 đến 5
        },
        images: [{
            type: String,
            default: null
        }],
        comment: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
