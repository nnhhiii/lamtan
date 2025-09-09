const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        description: {
            type: String,
            default: '',
        },
        logo: {
            type: String,
            default: 'https://res.cloudinary.com/dpuldllty/image/upload/v1736512130/default_tkzvsa.png',
        },
        bannerSideLeftBar: {
            type: String,
            default: 'https://res.cloudinary.com/dpuldllty/image/upload/v1736512130/default_tkzvsa.png',
        },
        address:[{
            type: String,
        }],
        hotline:[{
            type: String,
        }],
        facebook:{
            type: String,
        },
        zalo:{
            type: String,
        },
    },
    { timestamps: true } // Tự động thêm createdAt và updatedAt
);

const About = mongoose.model('About', aboutSchema);

module.exports = About;
