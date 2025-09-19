const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
const upload = require('../upload/uploadConfig');
const cloudinary = require('../upload/cloudinaryConfig');

// Lấy danh sách sản phẩm với phân trang, sắp xếp
router.get('/', async (req, res) => {
    try {
        const { _sort, _order, _start, _end, q } = req.query;

        // Sắp xếp
        let sort = {};
        if (_sort) {
            sort[_sort] = _order === 'DESC' ? -1 : 1;
        }

        // Phân trang
        const start = parseInt(_start) || 0;
        const end = parseInt(_end) || 10;
        const limit = end - start;

        // Tìm kiếm
        const query = {};
        if (q) {
            query.name = { $regex: q, $options: 'i' };
        }

        const products = await Product.find(query)
            .sort(sort)
            .skip(start)
            .limit(limit);

        const totalCount = await Product.countDocuments(query);

        const formattedProducts = products.map(product => ({
            ...product.toObject(),
            id: product._id,
        }));

        res.set('X-Total-Count', totalCount);
        res.set('Access-Control-Expose-Headers', 'X-Total-Count');
        res.json(formattedProducts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});



// Xem chi tiết sản phẩm
router.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        // Tìm sản phẩm theo id
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
        }

        // Chuyển đổi _id thành id
        const formattedProduct = {
            ...product.toObject(),
            id: product._id, // Thêm trường id
            _id: undefined   // Xóa trường _id nếu không cần thiết
        };

        // Gửi phản hồi
        res.json(formattedProduct);
    } catch (err) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy chi tiết sản phẩm', error: err.message });
    }
});

// Xem tất cả sản phẩm theo category id
router.get('/category/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;

        // Tìm danh sách sản phẩm có category = categoryId
        const products = await Product.find({ category: categoryId }).populate('category');

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách sản phẩm', error: err.message });
    }
});

// Tạo mới sản phẩm
router.post('/', upload.any(), async (req, res) => {
    try {
        const files = req.files || [];

        // Ảnh sản phẩm chính
        const productImages = files
            .filter(f => f.fieldname === 'images')
            .map(f => f.path);

        const images = productImages.length > 0
            ? productImages
            : ['https://res.cloudinary.com/dpuldllty/image/upload/v1736512130/default_tkzvsa.png'];

        // Parse variants
        let variants = [];
        if (req.body.variants) {
            variants = JSON.parse(req.body.variants);

            variants = variants.map((variant, index) => {
                const variantImages = files
                    .filter(f => f.fieldname === `variants[${index}]._newImages`)
                    .map(f => f.path);

                return {
                    ...variant,
                    images: [...(variant.images || []), ...variantImages]
                };
            });
        }

        const product = new Product({
            ...req.body,
            images,
            variants
        });

        const savedProduct = await product.save();
        res.status(201).json({
            id: savedProduct._id.toString(),
            ...savedProduct.toObject(),
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Cập nhật sản phẩm
router.put('/:id', upload.any(), async (req, res) => {
    try {
        const files = req.files || [];

        const existingImages = JSON.parse(req.body.existingImages || '[]');
        const newProductImages = files
            .filter(f => f.fieldname === 'newImages')
            .map(f => f.path);

        const updatedImages = [...existingImages, ...newProductImages];

        let variants = [];
        if (req.body.variants) {
            variants = JSON.parse(req.body.variants);

            variants = variants.map((variant, index) => {
                const variantImages = files
                    .filter(f => f.fieldname === `variants[${index}]._newImages`)
                    .map(f => f.path);

                const existingVariantImages = variant.images || [];
                return {
                    ...variant,
                    images: [...existingVariantImages, ...variantImages]
                };
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                images: updatedImages,
                variants
            },
            { new: true }
        );

        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});



// Xóa sản phẩm
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const defaultImage = 'https://res.cloudinary.com/dpuldllty/image/upload/v1736512130/default_tkzvsa.png';

        if (product.images && product.images.length > 0) {
            const getPublicId = (url) => {
                const parts = url.split('/');
                const versionIndex = parts.findIndex((part) => part.startsWith('v'));
                if (versionIndex === -1) return null;

                return parts.slice(versionIndex + 1).join('/').split('.')[0];
            };

            for (const imgUrl of product.images) {
                if (imgUrl.includes('https://res.cloudinary.com') && imgUrl !== defaultImage) {
                    const publicId = getPublicId(imgUrl);
                    if (publicId) {
                        await cloudinary.uploader.destroy(publicId);
                    }
                }
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
