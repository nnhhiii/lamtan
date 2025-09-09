const mongoose = require('mongoose');

const userAdminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true } // Tự động thêm createdAt và updatedAt
);

const UserAdmin = mongoose.model('UserAdmin', userAdminSchema);

module.exports = UserAdmin;
