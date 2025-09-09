const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: 'https://res.cloudinary.com/dpuldllty/image/upload/v1736512130/default_tkzvsa.png',
        }
    },
    { timestamps: true } // Tự động thêm createdAt và updatedAt
);

const Partner = mongoose.model('Partner', partnerSchema);

module.exports = Partner;
