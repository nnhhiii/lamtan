import { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Snackbar } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { useNavigate } from "react-router-dom";
import ROUTES from "../routes";
import { addToCart } from "../api/api";

const DialogSelectVariant = ({ product, onAddToCart, mode = "addToCart" }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [snackbar, setSnackbar] = useState({ open: false, message: "" });
    const navigate = useNavigate();

    const handleClickOpen = async () => {
        if (product?.variants?.length) {
            setOpenDialog(true);
        } else {
            if (mode === "addToCart") {
                onAddToCart(product?.id, null, 1);
            } else {
                // Mua ngay không có variant
                const productId = product?.id;
                const res = await addToCart({ productId, variantId: null, quantity: 1 });

                // Lấy id của item vừa thêm 
                const addedItemId = res?.cart.items?.slice(-1)[0]?._id;

                // Truyền id để tick sẵn
                navigate(ROUTES.CART, {
                    state: { preselected: [addedItemId] }
                });
            }
        }
    };

    const handleConfirm = async () => {
        if (!selectedVariant && product?.variants?.length > 0) {
            setSnackbar({ open: true, message: "Vui lòng chọn loại sản phẩm" });
            return;
        }
        if (quantity <= 0) {
            setSnackbar({ open: true, message: "Số lượng phải lớn hơn 0" });
            return;
        }

        if (mode === "addToCart") {
            onAddToCart(product?.id, selectedVariant?._id, quantity);
        } else {
            try {
                const productId = product?.id;
                const variantId = selectedVariant?._id || null;
                const res = await addToCart({ productId, variantId, quantity });

                const addedItemId = res?.cart?.items?.slice(-1)[0]?._id;

                navigate(ROUTES.CART, {
                    state: { preselected: [addedItemId] }
                });
            } catch (err) {
                console.error("Lỗi khi Buy Now:", err);
            }
        }

        setOpenDialog(false);
        setSelectedVariant(null);
        setQuantity(1);
    };

    return (
        <>
            <Button
                variant={mode === "addToCart" ? "outlined" : "contained"}
                onClick={handleClickOpen}
                sx={{ p: { xs: 3, md: 2 }, borderRadius: { xs: '0', md: 1 } }}
            >
                {mode === "addToCart" ? "Thêm vào giỏ hàng" : "Mua ngay"}
            </Button>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
                <DialogTitle>Chọn loại & số lượng</DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: 'gray' }}>Kho:{" "}
                        {selectedVariant
                            ? selectedVariant.stock
                            : product?.variants?.reduce((sum, v) => sum + (v.stock || 0), 0)}
                    </Typography>

                    {/* Danh sách variants */}
                    <Box sx={{ display: "flex", overflowX: "auto", py: 2 }}>
                        {product?.variants?.map((variant) => (
                            <Box
                                key={variant._id}
                                onClick={() => setSelectedVariant(variant)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexShrink: 0,
                                    mr: "10px",
                                    border: selectedVariant === variant
                                        ? "2px solid #B12024"
                                        : "1px solid lightgray",
                                    p: 1,
                                    borderRadius: 1,
                                    cursor: "pointer"
                                }}
                            >
                                {variant.images?.length > 0 && (
                                    <Box
                                        sx={{
                                            backgroundImage: `url(${variant.images[0]})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            width: "35px",
                                            height: "30px",
                                            mr: 1,
                                            borderRadius: 1
                                        }}
                                    />
                                )}
                                <span>{variant.name}</span>
                            </Box>
                        ))}
                    </Box>

                    {/* Số lượng */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
                        <Typography>Số lượng: </Typography>
                        <Box sx={{
                            width: "130px",
                            border: "1px solid lightgray",
                            borderRadius: 1,
                            p: 1,
                            display: "flex",
                            justifyContent: "space-between"
                        }}>
                            <RemoveRoundedIcon
                                sx={{ cursor: "pointer", color: "text.secondary" }}
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            />
                            <Typography>{quantity}</Typography>
                            <AddRoundedIcon
                                sx={{ cursor: "pointer", color: "text.secondary" }}
                                onClick={() => setQuantity((q) => q + 1)}
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                    <Button onClick={handleConfirm} variant="contained">
                        {mode === "addToCart" ? "Thêm" : "Mua ngay"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ open: false, message: "" })}
                message={snackbar.message}
            />
        </>
    );
};

export default DialogSelectVariant;
