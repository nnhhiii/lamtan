import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box, Typography, Button, RadioGroup, FormControlLabel, Radio, TextField, Divider } from "@mui/material";
import { checkout, createPayment } from "../api/api";
import PlaceIcon from '@mui/icons-material/Place';
import CheckoutItem from "../components/CheckoutItem";
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ROUTES from '../routes';
import VoucherCard from "../components/VoucherCard";
import Loading from '../components/Loading';

const paymentMethods = [
  { id: "cash_on_delivery", label: "Thanh toán khi nhận hàng", icon: <PaymentsOutlinedIcon sx={{ mr: 1 }} /> },
  { id: "bank_transfer_qr", label: "Chuyển khoản QR", icon: <AccountBalanceOutlinedIcon sx={{ mr: 1 }} /> },
];

const CheckoutPage = ({ userData, showSnackbar }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // dữ liệu nhận từ CartPage
  const {
    selectedItems = [],
    appliedDiscount,
    appliedShipping,
    total,
    discountValue = 0,
    shippingValue = 0,
    finalTotalPrice = 0
  } = state || {};

  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [note, setNote] = useState("");

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const body = {
        selectedItems: selectedItems.map(i => i._id),
        note,
        paymentMethod,
        totalPrice: finalTotalPrice
      };
      const order = await checkout(body);
      if (paymentMethod === "bank_transfer_qr") {
        const res = await createPayment({
          amount: finalTotalPrice,
          orderId: order?._id
        });

        if (res?.payUrl) {
          window.location.href = res.payUrl; // redirect sang trang MoMo
        } else {
          throw new Error("Không lấy được link thanh toán");
        }
      } else {
        navigate(`${ROUTES.ORDERSUCCESS}/${order._id}`);
      }
      showSnackbar(order.message, "success");
    } catch (err) {
      showSnackbar(err.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ my: { xs: '120px', md: '150px' }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'column', lg: 'row' }, gap: { xs: 1, md: 2 } }}>
            <Box sx={{ width: { xs: 1, md: '700px' }, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Box thông tin user (placeholder) */}
              <Box sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', }} onClick={() => navigate(ROUTES.PROFILE)}>
                  <Typography sx={{ fontWeight: 550, fontSize: '17px' }}>Thông tin người nhận</Typography>
                  <ArrowForwardIosRoundedIcon sx={{ scale: 0.7, color: 'lightgray' }} />
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', gap: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <PlaceIcon sx={{ color: 'primary.main' }} />
                      <Typography>Họ tên: {userData?.user.username}</Typography>
                    </Box>
                    <Typography>Địa chỉ: {userData?.user.address}</Typography>
                  </Box>
                  <Box sx={{ width: 'fit-content' }}>
                    <Typography gutterBottom sx={{ whiteSpace: 'nowrap' }}>Email: {userData?.user.email}</Typography>
                    <Typography>Sđt: {userData?.user.phone}</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Box phương thức thanh toán */}
              <Box sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2 }}>
                <Typography sx={{ fontWeight: 550, fontSize: '17px' }}>Phương thức thanh toán</Typography>
                <Divider sx={{ my: 1 }} />
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  {paymentMethods.map(pm => (
                    <FormControlLabel
                      key={pm.id}
                      value={pm.id}
                      control={<Radio />}
                      label={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {pm.icon}
                          {pm.label}
                        </Box>
                      }
                    />
                  ))}
                </RadioGroup>
              </Box>

              {/* Box sản phẩm */}
              <Box sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2 }}>
                <Typography sx={{ fontWeight: 550, fontSize: '17px' }}>Sản phẩm</Typography>
                <Divider sx={{ my: 1 }} />
                {selectedItems.map(item => (
                  <CheckoutItem key={item._id} item={item} />
                ))}
              </Box>
            </Box>



            <Box sx={{ width: { xs: 1, md: 1, lg: '500px' }, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Box khuyến mãi */}
              {(appliedDiscount || appliedShipping) && (
                <Box sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2 }}>
                  <Typography sx={{ fontWeight: 550, fontSize: '17px' }}>Khuyến mãi đã chọn</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {appliedDiscount && <VoucherCard textPromotion={appliedDiscount.promotion.title} />}
                    {appliedShipping && <VoucherCard textPromotion={appliedShipping.promotion.title} />}
                  </Box>
                </Box>
              )}

              {/* Box ghi chú */}
              <Box sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2 }}>
                <Typography gutterBottom sx={{ fontWeight: 550, fontSize: '17px' }}>Ghi chú</Typography>
                <TextField
                  fullWidth
                  placeholder="Nhập ghi chú cho đơn hàng"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  multiline
                  rows={3}
                />
              </Box>

              {/* Box chi tiết thanh toán */}
              <Box sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2 }}>
                <Typography sx={{ fontWeight: 550, fontSize: '17px' }}>Chi tiết thanh toán</Typography>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
                  <Typography>Tổng tiền hàng</Typography>
                  <Typography>{total.toLocaleString("vi-VN")} đ</Typography>
                </Box>
                {discountValue > 0 && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
                    <Typography>Giảm giá</Typography>
                    <Typography>-{discountValue.toLocaleString("vi-VN")} đ</Typography>
                  </Box>
                )}
                {shippingValue > 0 && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
                    <Typography>Giảm phí vận chuyển</Typography>
                    <Typography>-{shippingValue.toLocaleString("vi-VN")} đ</Typography>
                  </Box>
                )}

                <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
                  <Typography sx={{ fontWeight: 600 }}>Tổng thanh toán</Typography>
                  <Typography sx={{ color: "primary.main", fontWeight: 600 }}>
                    {finalTotalPrice.toLocaleString("vi-VN")} đ
                  </Typography>
                </Box>

                <Button variant="contained" fullWidth sx={{ mt: 2, display: { xs: 'none', md: "flex" } }} onClick={handleConfirm}>
                  Xác nhận thanh toán
                </Button>
              </Box>
            </Box>
          </Box>
          {/* Box chi tiết thanh toán */}
          <Box sx={{ p: 1, boxShadow: '0 -1px 10px #47474722', gap: 1, display: { xs: 'flex', md: "none" }, justifyContent: 'right', width: 1, bgcolor: "background.paper", position: 'fixed', bottom: 0, left: 0 }}>
            <Box>
              <Box sx={{ display: "flex", gap: 1, justifyContent: 'right' }}>
                <Typography sx={{ fontWeight: 600 }}>Tổng cộng</Typography>
                <Typography sx={{ color: "primary.main", fontWeight: 600 }}>
                  {finalTotalPrice.toLocaleString("vi-VN")} đ
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1, justifyContent: 'right' }}>
                <Typography sx={{ fontSize: '15px' }}>Tiết kiệm</Typography>
                <Typography sx={{ fontSize: '15px', color: "primary.main" }}>
                  {(shippingValue + discountValue).toLocaleString("vi-VN")} đ
                </Typography>
              </Box>
            </Box>

            <Button variant="contained" sx={{ height: '50px' }} onClick={handleConfirm}>
              Đặt hàng
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CheckoutPage;
