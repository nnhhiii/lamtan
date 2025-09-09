import { useEffect, useState } from "react";
import { Box, Typography, Dialog, DialogTitle, DialogContent } from "@mui/material";
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { getCategories } from "../api/api";
import Loading from "./Loading";
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';

const DialogGetDetailPromotion = ({ promotion }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCategories();
        setCategories(data);

      } catch (err) {
        console.error("Lỗi khi lấy danh mục sản phẩm:", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setOpenDialog(true)}>
        <Box sx={{ width: 0.9 }}>
          <Typography sx={{ fontWeight: 550, fontSize: '15px' }} >{promotion.title}</Typography>
          <Typography sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: '15px',
            lineHeight: 1.7
          }}>{promotion.description}</Typography>
        </Box>
        <InfoOutlineIcon sx={{ color: '#2F80ED' }} />
      </Box>

      {/* Dialog Khuyến mãi*/}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 5 } }}>
        <DialogTitle
          sx={{
            color: '#2F80ED',
            fontSize: '18px',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            boxShadow: '0 1px 5px #4b4b4b27'
          }}
        > <LocalOfferOutlinedIcon sx={{ mr: 1 }} />
        CHI TIẾT MÃ KHUYẾN MÃI
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Loading />
          ) : (
            <Box
              sx={{
                p: 1,
                display:'flex',
                flexDirection:'column',
                gap:1
              }}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '16px', my: 2 }}>{promotion.code} - {promotion.title}</Typography>
              <Box sx={{ bgcolor: '#FFF0D6', p: 2, color: '#763F0B', mb: 2 }}>
                {promotion.tiers.map((tier, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography>Đơn tối thiểu từ {tier.minOrderValue.toLocaleString()}đ {' '}
                      giảm {tier.discountType === "percentage" ? `${tier.discountValue}%` : `${tier.discountValue.toLocaleString()}đ`}
                    </Typography>
                    {tier.maxDiscountValue && (
                      <Typography>
                        Giảm tối đa: {tier.maxDiscountValue.toLocaleString()}đ
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
              <Typography>- Mô tả: {promotion.description}</Typography>
              {promotion.categories && promotion.categories.length > 0 && (
                <Typography>
                  - Danh mục giảm:{" "}
                  {promotion.categories
                    .map(catId => {
                      const category = categories.find(c => c.id === catId);
                      return category ? category.name : "";
                    })
                    .filter(name => name !== "")
                    .join(", ")}
                </Typography>
              )}
              <Typography>- Thời gian bắt đầu:{" "}
                {new Intl.DateTimeFormat("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(promotion.startDate))}
              </Typography>
              <Typography>- Thời gian kết thúc:{" "}
                {new Intl.DateTimeFormat("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(promotion.endDate))}
              </Typography>
              <Typography sx={{ mt:2 }}>- Số lượng mã: {promotion.usageLimit}</Typography>
              <Typography>- Số lượng mã đã sử dụng: {promotion.usedCount}</Typography>
              <Typography>- Số lượng mã còn lại: {promotion.usageLimit - promotion.usedCount}</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

    </>
  );
};

export default DialogGetDetailPromotion;
