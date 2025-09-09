const mongoose = require('mongoose');

const PostCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
    },
    { timestamps: true } 
);

const PostCategory = mongoose.model('PostCategory', PostCategorySchema);

module.exports = PostCategory;
