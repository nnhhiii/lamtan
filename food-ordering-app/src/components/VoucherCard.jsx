import { Box, Typography } from "@mui/material";

export default function VoucherCard({ textPromotion }) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "fit-content",
        bgcolor: "#FFF0D6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        overflow: "hidden",
        px: 3,
        py: 2,
      }}
    >
      {/* Chữ ở giữa */}
      <Typography sx={{ fontSize: "14px", color:'#763F0B', fontWeight:550 }}>{textPromotion}</Typography>

      {/* Bên trái: 3 lỗ */}
      {["20%", "50%", "80%"].map((top, idx) => (
        <Box
          key={`left-${idx}`}
          sx={{
            position: "absolute",
            left: -5,
            top,
            transform: "translateY(-50%)",
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            borderRadius: "50%",
          }}
        />
      ))}

      {/* Bên phải: 3 lỗ */}
      {["20%", "50%", "80%"].map((top, idx) => (
        <Box
          key={`right-${idx}`}
          sx={{
            position: "absolute",
            right: -5,
            top,
            transform: "translateY(-50%)",
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            borderRadius: "50%",
          }}
        />
      ))}
    </Box>
  );
}
