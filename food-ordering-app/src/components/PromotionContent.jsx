import { Typography, Box } from "@mui/material";
import DialogGetDetailPromotion from "./DialogGetDetailPromotion";
import ROUTES from '../routes';
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const PromotionContent = ({ bestPromotion, total, onApplyPromotion, inDialog = false, score, applied }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        if (applied) {
            // đang áp dụng → gỡ bỏ
            onApplyPromotion(bestPromotion, null);
        } else {
            // chưa áp dụng → áp dụng
            onApplyPromotion(bestPromotion, currentTier);
        }
    };

    if (!bestPromotion || !bestPromotion.tiers) return null;

    // Sắp xếp tier theo giá trị minOrderValue tăng dần
    const tiers = [...bestPromotion.tiers].sort((a, b) => a.minOrderValue - b.minOrderValue);

    // Xác định tier hiện tại
    let currentTierIndex = -1;
    tiers.forEach((tier, idx) => {
        if (total >= tier.minOrderValue) currentTierIndex = idx;
    });

    const currentTier = tiers[currentTierIndex] || null;
    const nextTier = tiers[currentTierIndex + 1] || null;

    // Nếu có next tier → tính phần trăm progress và số tiền còn thiếu
    let progressPercent = 100;
    let needMore = null;

    if (nextTier) {
        const range = nextTier.minOrderValue - (currentTier?.minOrderValue || 0);
        const progress = total - (currentTier?.minOrderValue || 0);
        progressPercent = Math.min((progress / range) * 100, 100);
        needMore = nextTier.minOrderValue - total;
    }

    // === CASE: Đang trong dialog và score > 0 ===
    if (inDialog && score > 0) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'space-between', height: 1 }}>
                <DialogGetDetailPromotion promotion={bestPromotion} />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '14px' }}>
                        HSD:{" "}
                        {new Intl.DateTimeFormat("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                        }).format(new Date(bestPromotion.endDate))}
                    </Typography>

                    {currentTier && (
                        <Box
                            onClick={handleClick}
                            sx={{
                                bgcolor: applied ? "transparent" : "#2F80ED",
                                p: "7px 15px",
                                fontSize: "13px",
                                borderRadius: 2,
                                color: applied ? "#2F80ED" : "white",
                                fontWeight: 550,
                                flexShrink: 0,
                                cursor: "pointer",
                                border: applied ? "1px solid #2F80ED" : "none",
                            }}
                        >
                            {applied ? "Đã áp dụng" : "Áp dụng"}
                        </Box>
                    )}
                </Box>
            </Box>
        );
    }

    // === CASE: CartPage hoặc dialog nhưng score = 0 (hiện bình thường) ===
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'space-between', height: 1 }}>
            <DialogGetDetailPromotion promotion={bestPromotion} />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ width: 0.7 }}>
                    <Typography sx={{ fontSize: '14px' }}>
                        HSD:{" "}
                        {new Intl.DateTimeFormat("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                            // hour: "2-digit",
                            // minute: "2-digit",
                        }).format(new Date(bestPromotion.endDate))}
                    </Typography>

                    {/* progress bar */}
                    {needMore !== null && (
                        <>
                            <Box sx={{ bgcolor: '#B7D3F8', height: '5px', borderRadius: 3, my: 0.5, position: 'relative' }}>
                                <Box
                                    sx={{
                                        bgcolor: '#2F80ED',
                                        height: '5px',
                                        borderRadius: 3,
                                        width: `${progressPercent}%`,
                                        transition: 'width 0.3s ease'
                                    }}
                                />
                            </Box>

                            <Typography sx={{ fontSize: '12px' }}>
                                Mua thêm {needMore.toLocaleString("vi-VN")}đ để được giảm {nextTier.discountType === "percentage"
                                    ? `${nextTier.discountValue}%`
                                    : `${nextTier.discountValue.toLocaleString("vi-VN")}đ`}
                            </Typography>
                        </>
                    )}
                </Box>

                {/* nút */}
                {needMore !== null ? (
                    <Box
                        onClick={() => navigate(ROUTES.PRODUCTS)}
                        sx={{
                            bgcolor: '#2F80ED',
                            p: '7px 15px',
                            fontSize: '13px',
                            borderRadius: 2,
                            color: 'white',
                            fontWeight: 550,
                            flexShrink: 0,
                            cursor: 'pointer'
                        }}
                    >
                        Mua thêm
                    </Box>
                ) : <Box

                    sx={{
                        bgcolor: "transparent",
                        fontSize: "15px",
                        fontWeight: 550,
                        flexShrink: 0,
                        borderBottom: '1px solid'
                    }}
                >
                    Đã đủ điều kiện
                </Box>}
            </Box>
        </Box>
    );
};
export default PromotionContent;