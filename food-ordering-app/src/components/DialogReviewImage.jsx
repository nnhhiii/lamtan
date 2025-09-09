import React, { useState } from "react";
import { Dialog, DialogContent, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ReviewImages = ({ images }) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOpen = (index) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {images && images.length > 0 && (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {images.map((img, i) => (
            <Box
              key={i}
              component="img"
              src={img}
              alt={`rating-img-${i}`}
              onClick={() => handleOpen(i)}
              sx={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: 1,
                cursor: "pointer",
              }}
            />
          ))}
        </Box>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogContent sx={{ position: "relative", p: 0, bgcolor: "#000" }}>
          {/* Nút close */}
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 8, right: 8, color: "#fff", zIndex: 2 }}
          >
            <CloseIcon />
          </IconButton>

          {/* Nút prev */}
          {images.length > 1 && (
            <IconButton
              onClick={handlePrev}
              sx={{
                position: "absolute",
                top: "50%",
                left: 8,
                transform: "translateY(-50%)",
                color: "#fff",
                zIndex: 2,
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          )}

          {/* Ảnh lớn */}
          <Box
            component="img"
            src={images[currentIndex]}
            alt="large"
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: "80vh",
              objectFit: "contain",
              display: "block",
            }}
          />

          {/* Nút next */}
          {images.length > 1 && (
            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                top: "50%",
                right: 8,
                transform: "translateY(-50%)",
                color: "#fff",
                zIndex: 2,
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewImages;
