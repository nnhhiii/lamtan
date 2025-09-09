import { useEffect, useState } from "react";
import { Typography, Box, Button, Checkbox, Snackbar, Alert } from "@mui/material";
import { getCarts, updateCartItem, deleteCartItem, getPromotions } from "../api/api";
import CartList from "../components/CartList";
import DiscountRoundedIcon from '@mui/icons-material/DiscountRounded';
import DialogGetPromotions from "../components/DialogGetPromotions";
import PromotionContent from "../components/PromotionContent";
import Loading from '../components/Loading';
import { useNavigate } from "react-router-dom";
import ROUTES from '../routes';


const CartPage = () => {
    const navigate = useNavigate();
    const [carts, setCarts] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState([]); // lưu item đã chọn
    const [bestPromotion, setBestPromotion] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [maxDiscountAcrossPromotions, setMaxDiscountAcrossPromotions] = useState(0);
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [appliedShipping, setAppliedShipping] = useState(null);


    // 1. Fetch carts & promotions (chạy 1 lần khi mount)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCarts();
                const dataPromotion = await getPromotions();

                // lọc luôn tại đây
                const filteredCarts = (data.items || []).filter(item => item.quantity > 0);
                const filteredPromotions = (dataPromotion || []).filter(promo => new Date(promo.endDate) > new Date());

                setCarts(filteredCarts);
                setPromotions(filteredPromotions);

            } catch (err) {
                console.error("Lỗi khi lấy giỏ hàng:", err);
                setOpenSnackbar(true);
                setCarts([]);
                setPromotions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // tính tổng theo selected
    const total = carts.reduce((sum, item) => {
        if (!selected.includes(item._id)) return sum;

        // Giá cơ bản: ưu tiên variantPrice, sau đó product.price
        const basePrice = item?.variantData?.price ?? item?.product?.price ?? 0;
        const discount = item?.variantData?.discount ?? item?.product?.discount;

        let finalPrice = Number(basePrice);

        if (typeof discount === 'string' && discount.includes('%')) {
            const percent = parseFloat(discount.replace('%', '')) || 0;
            finalPrice = basePrice - (basePrice * percent / 100);
        } else if (!isNaN(discount)) {
            finalPrice = basePrice - Number(discount);
        }
        return sum + finalPrice * item.quantity;
    }, 0);


    // 2. Tính bestPromotion mỗi khi giỏ hàng / chọn / promotion thay đổi
    useEffect(() => {
        if (promotions.length === 0) return;

        const selectedItems = carts.filter(item => selected.includes(item._id));

        // Tính giá trị giảm tối đa của từng promotion trước
        const discounts = promotions.map(promo => {
            const validTier = promo.tiers
                ?.filter(tier => total >= (tier.minOrderValue || 0))
                .sort((a, b) => b.minOrderValue - a.minOrderValue)[0];
            return calculateDiscount(validTier, total);
        });

        const maxDiscountAcrossPromotions = Math.max(...discounts, 0);

        let best = promotions[0];
        let maxScore = 0;

        promotions.forEach(promo => {
            const score = checkPromotion(promo, selectedItems, total, maxDiscountAcrossPromotions);
            if (score > maxScore) {
                maxScore = score;
                best = promo;
            }
        });

        setMaxDiscountAcrossPromotions(Math.max(...discounts, 0));
        setBestPromotion(best);
    }, [selected, carts, promotions, total]);



    // toggle chọn tất cả
    const handleToggleAll = (checked) => {
        if (checked) {
            setSelected(carts.map(item => item._id));
        } else {
            setSelected([]);
        }
    };

    // toggle chọn 1 item
    const handleToggleOne = (id) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    // update số lượng
    const handleUpdateQuantity = async (id, newQty, variantId = null) => {
        if (newQty <= 0) return;
        try {
            const updatedCart = await updateCartItem(id, variantId, newQty);
            setCarts(updatedCart.items || []);
        } catch (err) {
            console.error("Lỗi update quantity:", err);
        }
    };


    // update variant 
    const handleUpdateVariant = async (id, quantity = null, newVariantId) => {
        try {
            const updatedCart = await updateCartItem(id, newVariantId, quantity);
            // backend trả về cả cart mới có variantData
            setCarts(updatedCart.items || []);
        } catch (err) {
            console.error("Lỗi update variant:", err);
        }
    };

    // delete item
    const handleDelete = async (id) => {
        try {
            await deleteCartItem(id);
            setCarts(prev => prev.filter(item => item._id !== id));
            setSelected(prev => prev.filter(i => i !== id));
        } catch (err) {
            console.error("Lỗi xóa item:", err);
        }
    };

    // Hàm tính giá trị giảm thực tế
    const calculateDiscount = (tier, total) => {
        if (!tier) return 0;
        let discount = 0;

        if (tier.discountType === "percentage") {
            discount = (total * tier.discountValue) / 100;
            if (tier.maxDiscountValue) {
                discount = Math.min(discount, tier.maxDiscountValue);
            }
        } else if (tier.discountType === "fixed") {
            discount = tier.discountValue;
        }

        return discount;
    };

    const checkPromotion = (promotion, selectedItems, total, maxDiscountAcrossPromotions) => {
        let score = 0;

        if (!selectedItems || selectedItems.length === 0) {
            return 0;
        }

        let discountAmount = 0;

        // ---- Điều kiện tiers
        if (promotion.tiers && promotion.tiers.length > 0) {
            const validTier = promotion.tiers
                .filter(tier => total >= (tier.minOrderValue || 0))
                .sort((a, b) => b.minOrderValue - a.minOrderValue)[0];

            if (validTier) {
                discountAmount = calculateDiscount(validTier, total);
                score++
                // Nếu là giá trị giảm cao nhất → cộng thêm điểm
                if (discountAmount === maxDiscountAcrossPromotions) {
                    score++;
                }
            } else {
                return -1;
            }
        }

        // ---- Điều kiện categories
        if (promotion.categories && promotion.categories.length > 0) {
            const hasCategory = selectedItems.some(item =>
                item?.product?.category &&
                promotion.categories.some(catId => String(catId) === String(item.product.category))
            );
            if (!hasCategory) {
                return -1;
            }
            score++;
        }

        // ---- Điều kiện usageLimit
        if ((promotion.usageLimit || 0) > (promotion.usedCount || 0)) {
            score++;
        }

        return score;
    };

    const discountValue = appliedDiscount ? calculateDiscount(appliedDiscount.tier, total) : 0;
    const shippingValue = appliedShipping ? calculateDiscount(appliedShipping.tier, total) : 0;
    const finalTotalPrice = total - discountValue - shippingValue;

    return (
        <Box sx={{ m: { xs: '120px 0', md: '150px 0' }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Box>
                <Typography variant="h5">
                    🛒 Giỏ hàng ({carts.length})
                </Typography>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={5000}
                    onClose={() => setOpenSnackbar(false)}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert onClose={() => setOpenSnackbar(false)} severity="warning" sx={{ width: "100%" }}>
                        Vui lòng đăng nhập để xem giỏ hàng!
                    </Alert>
                </Snackbar>
                {loading ? (
                    <Loading />
                ) : carts.length === 0 ? (
                    <Box sx={{ bgcolor: 'background.paper', p: 5, mt: 5, textAlign: 'center', borderRadius: 3 }}>
                        <Typography>Chưa có món nào trong giỏ hàng</Typography>
                    </Box>
                ) : (
                    <Box>
                        <Box sx={{ display: "flex", flexDirection: { xs: 'column-reverse', md: 'column-reverse', lg: 'row' }, width: 1, gap: 2 }}>
                            <Box sx={{ display: "flex", flexDirection: "column", mt: 3, width: { xs: 1, md: '810px' } }}>
                                <Box sx={{
                                    height: '50px',
                                    bgcolor: 'background.paper',
                                    borderRadius: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    px: 1
                                }}>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Checkbox
                                            checked={selected.length === carts.length}
                                            indeterminate={selected.length > 0 && selected.length < carts.length}
                                            onChange={(e) => handleToggleAll(e.target.checked)}
                                        />
                                        <Typography>Chọn tất cả</Typography>
                                    </Box>
                                    <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'space-between', width: '200px', mr: 13 }}>
                                        <Typography>Số lượng</Typography>
                                        <Typography>Thành tiền</Typography>
                                    </Box>
                                </Box>

                                <CartList
                                    items={carts}
                                    selected={selected}
                                    onToggle={handleToggleOne}
                                    onUpdateQty={handleUpdateQuantity}
                                    onDelete={handleDelete}
                                    onUpdateToCart={handleUpdateVariant}
                                />
                            </Box>

                            {/* Sidebar Khuyến mãi vs Thanh toán */}
                            <Box sx={{ display: "flex", flexDirection: "column", mt: 3, width: { xs: 1, md: '810px', lg: '385px' }, gap: 1 }}>
                                <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, width: 1, px: 2, py: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, color: '#2F80ED' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }} >
                                            <DiscountRoundedIcon sx={{ mr: 1 }} />
                                            Khuyến mãi
                                        </Box>
                                        <DialogGetPromotions
                                            promotions={promotions}
                                            carts={carts}
                                            checkPromotion={checkPromotion}
                                            total={total}
                                            selected={selected}
                                            maxDiscountAcrossPromotions={maxDiscountAcrossPromotions}
                                            onApplyPromotion={(promotion, tier) => {
                                                if (!promotion) return;

                                                if (promotion.type === "discount") {
                                                    if (!tier) {
                                                        setAppliedDiscount(null); // gỡ
                                                    } else {
                                                        setAppliedDiscount({ promotion, tier });
                                                    }
                                                } else if (promotion.type === "shipping") {
                                                    if (!tier) {
                                                        setAppliedShipping(null); // gỡ
                                                    } else {
                                                        setAppliedShipping({ promotion, tier });
                                                    }
                                                }
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ border: '1px solid #F5F5F5' }} />
                                    <Box sx={{ pt: 2 }}>
                                        {bestPromotion ? (
                                            <PromotionContent
                                                bestPromotion={bestPromotion}
                                                total={total} />
                                        ) : (
                                            <Typography>Không có khuyến mãi phù hợp</Typography>
                                        )}
                                    </Box>
                                </Box>
                                <Box sx={{ display: { xs: 'none', md: 'block' }, bgcolor: 'background.paper', borderRadius: 3, width: 1, px: 2, py: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                                        <Typography>Thành tiền</Typography>
                                        <Typography>{total.toLocaleString("vi-VN")} đ</Typography>
                                    </Box>

                                    {/* Nhóm giảm giá */}
                                    {appliedDiscount && (
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                                            <Typography>{appliedDiscount.promotion.title}</Typography>
                                            <Typography>-{discountValue.toLocaleString("vi-VN")} đ</Typography>
                                        </Box>
                                    )}

                                    {/* Nhóm vận chuyển */}
                                    {appliedShipping && (
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                                            <Typography>{appliedShipping.promotion.title}</Typography>
                                            <Typography>-{shippingValue.toLocaleString("vi-VN")} đ</Typography>
                                        </Box>
                                    )}


                                    <Box sx={{ border: '1px solid #F5F5F5' }} />
                                    <Box sx={{ py: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography sx={{ fontWeight: 550, fontSize: '15px' }}>Tổng số tiền (gồm VAT)</Typography>
                                            <Typography sx={{ fontWeight: 550, fontSize: '18px', color: 'primary.main' }}>
                                                {finalTotalPrice.toLocaleString("vi-VN")} đ
                                            </Typography>
                                        </Box>
                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                navigate(ROUTES.CHECKOUT, {
                                                    state: {
                                                        selectedItems: carts.filter(item => selected.includes(item._id)), // sản phẩm đã chọn
                                                        appliedDiscount,
                                                        appliedShipping,
                                                        total,
                                                        discountValue,
                                                        shippingValue,
                                                        finalTotalPrice
                                                    }
                                                })
                                            }
                                            disabled={selected.length === 0} // disable nếu chưa chọn sp
                                            fullWidth
                                            sx={{ mt: 2 }}
                                        >
                                            Thanh toán
                                        </Button>

                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, boxShadow: '0 -1px 5px #0000001f', justifyContent: 'space-between', position: 'fixed', left: 0, bottom: 0, bgcolor: 'background.paper', width: 1 }}>
                            <Box sx={{ p: '10px 20px' }}>
                                <Typography>Tổng cộng</Typography>
                                <Typography sx={{ color: 'primary.main', fontWeight: 550 }}>{finalTotalPrice.toLocaleString("vi-VN")} đ</Typography>
                            </Box>
                            <Button variant="contained" sx={{ borderRadius: 0 }}>Thanh toán</Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default CartPage;
