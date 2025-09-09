const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: '',
        },
        image: {
            type: String,
            default: 'https://res.cloudinary.com/dpuldllty/image/upload/v1736512130/default_tkzvsa.png',
        },
        banner: {
            type: String,
            default: 'https://res.cloudinary.com/dpuldllty/image/upload/v1736512130/default_tkzvsa.png',
        }
    },
    { timestamps: true } // Tự động thêm createdAt và updatedAt
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
