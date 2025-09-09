const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const router = express.Router();


// Lấy danh sách giỏ hàng với phân trang, sắp xếp
router.get('/', async (req, res) => {
  try {
    const { _sort, _order, _start, _end, user } = req.query;

    // Sắp xếp
    let sort = {};
    if (_sort) {
      sort[_sort] = _order === 'DESC' ? -1 : 1;
    }

    // Phân trang
    const start = parseInt(_start) || 0;
    const end = parseInt(_end) || 10;

    // Lọc
            const query = {};
            
            // Lọc theo user (dropdown)
            if (user) {
                query.user = user;
            }

    
    const carts = await Cart.find(query)
      .sort(sort)
      .skip(start)
      .limit(end - start);

    // Map sang object + thêm variantData
    const formattedCarts = await Promise.all(
      carts.map(async (cart) => {
        const obj = cart.toObject();
        obj.id = cart._id;

        // Lấy tất cả productIds có trong cart
        const productIds = obj.items.map((i) => i.product);

        // Query trước products để tra variant
        const products = await Product.find({ _id: { $in: productIds } });

        obj.items = obj.items.map((item) => {
          const prod = products.find((p) => p._id.toString() === item.product.toString());
          if (item.variant && prod?.variants) {
            const variantData = prod.variants.find(
              (v) => v._id.toString() === item.variant.toString()
            );
            return { ...item, variantData };
          }
          return item;
        });

        return obj;
      })
    );

    const totalCount = await Cart.countDocuments(query);
    res.set('X-Total-Count', totalCount);
    res.set('Access-Control-Expose-Headers', 'X-Total-Count');
    res.json(formattedCarts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Lấy giỏ hàng của user
router.get('/getCartByUserId', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Vui lòng đăng nhập!' });
    }
    const userId = req.session.user._id;

    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart) {
            return res.json({ items: [] });
        }

        // Xử lý lấy variantData cho từng item
        const itemsWithVariants = cart.items.map(item => {
            const variantData = item.product?.variants.find(
                v => v._id.toString() === item.variant.toString()
            );
            return {
                ...item.toObject(),
                variantData
            };
        });

        res.json({ ...cart.toObject(), items: itemsWithVariants });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// POST: Thêm sản phẩm vào giỏ
router.post('/addCartByUserId', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Vui lòng đăng nhập!' });
  }
  const userId = req.session.user._id;
  const { productId, variantId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "productId is required" });
  }

  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const index = cart.items.findIndex(
      i => i.product?.toString() === productId &&
           (i.variant ? i.variant.toString() : null) === (variantId ? variantId.toString() : null)
    );

    if (index > -1) {
      cart.items[index].quantity += quantity || 1;
    } else {
      cart.items.push({
        product: productId,
        variant: variantId || null,
        quantity: quantity || 1,
      });
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    const cartWithVariant = populatedCart.toObject();
    cartWithVariant.items = cartWithVariant.items.map(item => {
      if (item.variant && item.product?.variants) {
        const variantData = item.product.variants.find(v => v._id.toString() === item.variant.toString());
        return { ...item, variantData };
      }
      return item;
    });

    res.json(cartWithVariant);
  } catch (err) {
    console.error("AddCart error:", err);
    res.status(500).json({ error: err.message });
  }
});



// PUT: Cập nhật số lượng hoặc đổi variant 1 item trong giỏ
router.put('/updateCartByUserId/:itemId', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Vui lòng đăng nhập!' });
    }
    const userId = req.session.user._id;
    const { itemId } = req.params;
    const { quantity, variantId } = req.body;

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

        const item = cart.items.id(itemId);
        if (!item) return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });

        if (quantity <= 0) {
            item.remove(); // xoá item
        } else {
            // Nếu có đổi variant
            if (variantId && item.variant?.toString() !== variantId) {
                // Kiểm tra xem trong giỏ đã có product + variant mới chưa
                const existingIndex = cart.items.findIndex(
                    i => i.product.toString() === item.product.toString() &&
                         i.variant?.toString() === variantId
                );

                if (existingIndex > -1) {
                    // Nếu đã có thì cộng dồn số lượng
                    cart.items[existingIndex].quantity += quantity;
                    item.remove(); // xoá item cũ
                } else {
                    // Nếu chưa có thì chỉ đổi variant
                    item.variant = variantId;
                    item.quantity = quantity;
                }
            } else {
                // Không đổi variant, chỉ cập nhật số lượng
                item.quantity = quantity;
            }
        }

        await cart.save();

        const populatedCart = await Cart.findById(cart._id).populate('items.product');

        // thêm dữ liệu variant cho từng item
        const cartWithVariant = populatedCart.toObject();
        cartWithVariant.items = cartWithVariant.items.map(i => {
            if (i.variant && i.product?.variants) {
                const variantData = i.product.variants.find(v => v._id.toString() === i.variant.toString());
                return { ...i, variantData };
            }
            return i;
        });

        res.json(cartWithVariant);
    } catch (err) {
        console.error("UpdateCart error:", err);
        res.status(500).json({ error: err.message });
    }
});


// DELETE: Xóa 1 item trong giỏ
router.delete('/deleteCartItemByUserId/:itemId', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Vui lòng đăng nhập!' });
    }

    const userId = req.session.user._id;
    const { itemId } = req.params;

    try {
        // Tìm và xóa item theo _id trong mảng items
        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            { $pull: { items: { _id: itemId } } },
            { new: true }
        ).populate('items.product');

        if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

        res.json(cart);
    } catch (err) {
        console.error("DeleteCart error:", err);
        res.status(500).json({ error: err.message });
    }
});


// Xóa giỏ hàng
router.delete('/:id', async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.json({ message: 'Xóa giỏ hàng thành công!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;
