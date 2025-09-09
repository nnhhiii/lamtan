import { useState } from "react";
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

const UpdateToCartWithVariant = ({ item, onUpdateToCart }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVariantId, setselectedVariantId] = useState(item?.variant || null);

  const handleClickVariant = () => {
    setselectedVariantId(item?.variant || null); // id variant đã lưu trong cart
    setOpenDialog(true);
  };

  const handleConfirm = () => {
    onUpdateToCart(item._id, item?.quantity, selectedVariantId); // selectedVariantId là id
    setOpenDialog(false);
  };


  return (
    <>
      {item?.variantData && (
        <Box
          sx={{
            display: "flex",
            width: "fit-content",
            height: "25px",
            color: "text.secondary",
            border: "1px solid lightgray",
            borderRadius: 1,
            p: 1,
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={handleClickVariant}
        >
          <Typography sx={{ fontSize: "12px" }}>
            {item.variantData.name}
          </Typography>
          <KeyboardArrowDownRoundedIcon sx={{ scale: 0.7 }} />
        </Box>
      )}

      {/* Dialog chọn variant */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>Chọn loại & số lượng</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'gray' }}>
            Kho:{' '}
            {selectedVariantId
              ? item.product?.variants?.find(v => v._id === selectedVariantId)?.stock
              : item.product?.variants?.reduce((sum, v) => sum + (v.stock || 0), 0)}
          </Typography>

          {/* Danh sách variants */}
          <Box sx={{ display: "flex", overflowX: "auto", py: 2 }}>
            {item?.product?.variants?.map((variant) => (
              <Box
                key={variant._id}
                onClick={() => setselectedVariantId(variant._id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                  mr: "10px",
                  border:
                    selectedVariantId === variant._id
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleConfirm} variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateToCartWithVariant;
