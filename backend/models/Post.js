const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
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
        postCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PostCategory',
            required: true,
        },
    },
    { timestamps: true } // Tự động thêm createdAt và updatedAt
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
