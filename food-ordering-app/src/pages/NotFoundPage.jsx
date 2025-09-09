// src/pages/NotFoundPage.jsx
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ROUTES from "../routes";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 2,
        bgcolor: "background.default",
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
        404
      </Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(ROUTES.HOME)}
      >
        Quay về trang chủ
      </Button>
    </Box>
  );
};

export default NotFoundPage;
