// src/pages/TransferSuccess.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ROUTES from "../routes";
import Loading from "../components/Loading";

export default function TransferSuccess() {
  const [status, setStatus] = useState("loading");
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const resultCode = searchParams.get("resultCode");
    if (resultCode === "0") {
      setStatus("success");
    } else {
      setStatus("failed");
    }
  }, [searchParams]);

  if (status === "loading") {
    return (
      <Box sx={{ m: { xs: '120px 0', md: '150px 0' }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loading/>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        my: { xs: "120px", md: "150px" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          bgcolor: "background.paper",
          width: { xs: 0.9, md: 0.8 },
          py: { xs: 15, md: 20 },
          borderRadius: 3
        }}
      >
        {status === "success" ? (
          <>
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "green" }} />
            <Typography variant="h4" sx={{ mt: 2 }}>
              Thanh toán thành công!
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Cảm ơn bạn đã thanh toán qua MoMo 🎉
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
              {orderId}
            </Typography>
          </>
        ) : (
          <>
            <ErrorOutlineIcon sx={{ fontSize: 80, color: "red" }} />
            <Typography variant="h4" sx={{ mt: 2 }}>
              Thanh toán thất bại
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức khác.
            </Typography>
          </>
        )}

        <Box sx={{ mt: 3 }}>
          <Button component={Link} to={ROUTES.HOME} variant="contained" sx={{ mr: 2 }}>
            Về trang chủ
          </Button>
          <Button component={Link} to={`${ROUTES.ORDERDETAIL}/${orderId}`} variant="outlined">
            Xem chi tiết đơn hàng
          </Button>
          {status === "failed" && (
            <Button component={Link} to={ROUTES.CART} variant="outlined">
              Thử lại thanh toán
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
