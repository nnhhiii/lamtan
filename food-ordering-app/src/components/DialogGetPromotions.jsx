import { useState } from "react";
import { Box, Typography, Dialog, DialogTitle, DialogContent, Snackbar, Alert } from "@mui/material";
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import DiscountOutlinedIcon from '@mui/icons-material/DiscountOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PromotionContent from "./PromotionContent";
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';

const DialogGetPromotions = ({ promotions, carts, selected, checkPromotion, total, maxDiscountAcrossPromotions, onApplyPromotion }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [showAllDiscount, setShowAllDiscount] = useState(false);
  const [showAllShipping, setShowAllShipping] = useState(false);

  // lưu state mã đã áp dụng
  const [appliedDiscountId, setAppliedDiscountId] = useState(null);
  const [appliedShippingId, setAppliedShippingId] = useState(null);

  // snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const handleApplyPromotion = (promo, currentTier) => {
    if (!promo) return; // luôn có promo, null sẽ không vào đây

    if (promo.type === "discount") {
      if (!currentTier) {
        // gỡ bỏ discount
        setAppliedDiscountId(null);
        onApplyPromotion(promo, null);
        return;
      }
      if (appliedDiscountId && appliedDiscountId !== promo.id) {
        setSnackbar({ open: true, message: "Bạn chỉ được dùng 1 mã giảm giá mỗi lần." });
        return;
      }
      setAppliedDiscountId(promo.id);
    } else if (promo.type === "shipping") {
      if (!currentTier) {
        // gỡ bỏ shipping
        setAppliedShippingId(null);
        onApplyPromotion(promo, null);
        return;
      }
      if (appliedShippingId && appliedShippingId !== promo.id) {
        setSnackbar({ open: true, message: "Bạn chỉ được dùng 1 mã vận chuyển mỗi lần." });
        return;
      }
      setAppliedShippingId(promo.id);
    }

    // áp dụng
    onApplyPromotion(promo, currentTier);
  };



  // Gom tính điểm trước
  const processedPromos = [...promotions]
    .map(promo => {
      const selectedItems = carts?.filter(item => selected.includes(item._id));
      const score = checkPromotion(promo, selectedItems, total, maxDiscountAcrossPromotions);
      return { ...promo, score };
    })
    .sort((a, b) => b.score - a.score);

  const discountPromos = processedPromos.filter(p => p.type === "discount");
  const shippingPromos = processedPromos.filter(p => p.type !== "discount");

  const renderPromoBox = (promo) => (
    <Box
      key={promo.id}
      sx={{
        opacity: promo.score > 0 ? 1 : 0.4,
        mb: 2,
        borderRadius: 2,
        boxShadow: '0 0 10px #4d4d4d27',
        display: 'flex',
        width: 1,
        p: 1,
        height: '130px',
        gap: 2,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {promo.usedCount / promo.usageLimit > 0.5 && (
        <Box
          sx={{
            bgcolor: 'red',
            position: 'absolute',
            top: 0,
            left: 0,
            p: '5px',
            fontSize: '14px',
            color: 'white',
            borderRadius: '0 0 10px 0',
          }}
        >
          Sắp hết
        </Box>
      )}

      <Box
        sx={{
          bgcolor: promo.type === "discount" ? "#FFF0D6" : "#E3FADB",
          width: 1 / 4,
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          color: promo.type === "discount" ? '#FFB322' : '#25C16B',
          borderRadius: 2
        }}
      >
        {promo.type === "discount" ? (
          <LocalOfferOutlinedIcon sx={{ scale: 2 }} />
        ) : (
          <LocalShippingOutlinedIcon sx={{ scale: 2 }} />
        )}
      </Box>

      <Box sx={{ width: 3 / 4 }}>
        <PromotionContent
          bestPromotion={promo}
          total={total}
          onApplyPromotion={handleApplyPromotion}
          inDialog
          score={promo.score}
          applied={
            (promo.type === "discount" && appliedDiscountId === promo.id) ||
            (promo.type !== "discount" && appliedShippingId === promo.id)
          }
        />
      </Box>
    </Box>
  );

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setOpenDialog(true)}>
        Xem thêm
        <ArrowForwardIosRoundedIcon />
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm" PaperProps={{sx: { borderRadius: 5 }}}>
        <DialogTitle
          sx={{
            color: '#2F80ED',
            fontSize: '18px',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            boxShadow: '0 1px 5px #4b4b4b27'
          }}
        >
          <DiscountOutlinedIcon sx={{ mr: 1 }} />
          MÃ KHUYẾN MÃI
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mt: 3 }}>

            {/* Nhóm mã giảm giá */}
            {discountPromos.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
                    Mã giảm giá
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: 'gray' }}>
                    Áp dụng tối đa: 1
                  </Typography>
                </Box>
                {(showAllDiscount ? discountPromos : discountPromos.slice(0, 3)).map(p => renderPromoBox(p))}
                {discountPromos.length > 3 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ cursor: 'pointer', color: '#2F80ED', width: 'fit-content', py: 1, px: 2, display: 'flex', justifyContent: 'center' }}
                      onClick={() => setShowAllDiscount(!showAllDiscount)}
                    >
                      {showAllDiscount ? <>Rút gọn <KeyboardArrowUpRoundedIcon /></> : <>Xem thêm <KeyboardArrowDownRoundedIcon /></>}
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {/* Nhóm mã vận chuyển */}
            {shippingPromos.length > 0 && (
              <Box>
                <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
                    Mã vận chuyển
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: 'gray' }}>
                    Áp dụng tối đa: 1
                  </Typography>
                </Box>
                {(showAllShipping ? shippingPromos : shippingPromos.slice(0, 3)).map(p => renderPromoBox(p, appliedShippingId))}
                {shippingPromos.length > 3 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ cursor: 'pointer', color: '#2F80ED', width: 'fit-content', py: 1, px: 2, display: 'flex', justifyContent: 'center' }}
                      onClick={() => setShowAllShipping(!showAllShipping)}
                    >
                      {showAllShipping ? <>Rút gọn <KeyboardArrowUpRoundedIcon /></> : <>Xem thêm <KeyboardArrowDownRoundedIcon /></>}
                    </Box>
                  </Box>
                )}
              </Box>
            )}

          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity="warning" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DialogGetPromotions;
