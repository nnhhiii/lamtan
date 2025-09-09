const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        price: {
            type: mongoose.Schema.Types.Mixed, // Giá mặc định nếu không có biến thể
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
        origin: {
            type: String,
            default: ''
        },
        ingredients: {
            type: String,
            default: ''
        },
        expiredDay: {
            type: String,
            default: ''
        },
        preservation: {
            type: String,
            default: ''
        },
        instruction: {
            type: String,
            default: ''
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        images: [{
            type: String,
            default: 'https://res.cloudinary.com/dpuldllty/image/upload/v1736512130/default_tkzvsa.png',
        }],
        averageRating: {
            type: Number,
            default: 0, // Điểm đánh giá trung bình
            min: 0,
            max: 5,
        },
        totalRatings: {
            type: Number,
            default: 0
        },
        quantitySold: {
            type: Number,
            default: 0
        },
        discount: {
            type: String,
            default: ''
        },
        variants: [
            {
                name: {
                    type: String,
                    required: true,
                },
                images: [{
                    type: String
                }],

                price: {
                    type: mongoose.Schema.Types.Mixed,
                    default: '',
                },
                discount: {
                    type: String,
                    default: ''
                },
                stock: {
                    type: Number,
                    default: 0,
                },
                isAvailable: {
                    type: Boolean,
                    default: true,
                },
            }
        ],
    },
    { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
