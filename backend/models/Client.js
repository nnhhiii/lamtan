const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
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

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
