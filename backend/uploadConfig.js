const multer = require('multer');
const cloudinary = require('./cloudinaryConfig'); // Import cấu hình Cloudinary
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cấu hình lưu trữ cho Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        
        // Xác định tên file duy nhất
        const timestamp = Date.now();
        const uniqueName = `${timestamp}-${Math.round(Math.random() * 1e9)}`;

        return {
            folder: 'lamtan_project/',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Chỉ cho phép định dạng ảnh
            public_id: uniqueName, // Tên file duy nhất trên Cloudinary
        };
    },
});

// Khởi tạo Multer với CloudinaryStorage
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); // Chấp nhận file
        } else {
            cb(new Error('Only image files are allowed!'), false); // Từ chối file
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file (5MB)
});

module.exports = upload;
