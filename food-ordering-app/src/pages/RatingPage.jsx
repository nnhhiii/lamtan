// src/pages/RatingPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Rating as MuiRating,
    Box, Link,
    Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { createRating, getOrderDetail } from "../api/api";
import Loading from "../components/Loading";
import ROUTES from "../routes";

const Input = styled("input")({
    display: "none",
});

export default function RatingPage({ showSnackbar }) {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [ratings, setRatings] = useState({}); // lưu đánh giá theo productId
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await getOrderDetail(orderId);
                setOrder(data);

                // khởi tạo state cho từng product
                const init = {};
                data.items.forEach((item) => {
                    init[item.product._id] = {
                        rating: 5,
                        comment: "",
                        images: [],
                    };
                });
                setRatings(init);
            } catch (err) {
                showSnackbar(err.response?.data?.message, "error");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId, showSnackbar]);

    const handleImageChange = (productId, files) => {
        setRatings((prev) => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                images: Array.from(files),
            },
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            for (const item of order.items) {
                const { rating, comment, images } = ratings[item.product._id];

                // Nếu user không đánh giá sản phẩm này thì bỏ qua
                if (!rating && !comment && images.length === 0) continue;

                const formData = new FormData();
                formData.append("product", item.product._id);
                formData.append("order", orderId);
                formData.append("rating", rating);
                formData.append("comment", comment);

                images.forEach((img) => {
                    formData.append("images", img);
                });

                await createRating(formData);
            }

            showSnackbar("Đánh giá thành công!", "success");
            navigate(-1);
        } catch (err) {
            showSnackbar(err.response?.data?.message, "error");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ m: { xs: '120px 0', md: '150px 0' }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loading />
            </Box>
        )
    }

    if (!order) {
        return (
            <Box sx={{ my: { xs: '120px', md: '150px' }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ width: { xs: 1, md: 600 }, bgcolor: 'background.paper', px: 3, py: 5, borderRadius: 3, textAlign: 'center' }}>
                    <Typography variant="h6" color="error">
                        Không tìm thấy đơn hàng
                    </Typography>
                    <Button component={Link} to={ROUTES.HOME} variant="contained" sx={{ mt: 2 }}>
                        Về trang chủ
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ my: 15 }}>
            <Typography variant="h6" gutterBottom>
                Đánh giá đơn hàng #{order._id}
            </Typography>

            {order.items.map((item) => {
                const productId = item.product._id;
                const state = ratings[productId] || {};
                return (
                    <Card key={productId} sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <Avatar
                                    src={item.product.images[0]}
                                    variant="square"
                                    sx={{ width: 64, height: 64, mr: 2 }}
                                />
                                <Typography>{item.product.name}</Typography>
                            </Box>

                            {/* Rating stars */}
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <MuiRating
                                    value={state.rating}
                                    onChange={(e, newValue) =>
                                        setRatings((prev) => ({
                                            ...prev,
                                            [productId]: { ...prev[productId], rating: newValue },
                                        }))
                                    }
                                />
                                <Typography sx={{ ml: 2 }}>{state.rating} sao</Typography>
                            </Box>

                            {/* Comment */}
                            <TextField
                                fullWidth
                                label="Nhận xét"
                                multiline
                                rows={2}
                                value={state.comment}
                                onChange={(e) =>
                                    setRatings((prev) => ({
                                        ...prev,
                                        [productId]: { ...prev[productId], comment: e.target.value },
                                    }))
                                }
                                sx={{ mb: 2 }}
                            />

                            {/* Upload images */}
                            <label htmlFor={`upload-${productId}`}>
                                <Input
                                    id={`upload-${productId}`}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) =>
                                        handleImageChange(productId, e.target.files)
                                    }
                                />
                                <Button variant="outlined" component="span">
                                    Chọn ảnh
                                </Button>
                            </label>

                            <Box sx={{ display: "flex", flexWrap: "wrap", mt: 1 }}>
                                {state.images?.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={URL.createObjectURL(img)}
                                        alt="preview"
                                        style={{
                                            width: 80,
                                            height: 80,
                                            objectFit: "cover",
                                            margin: 4,
                                        }}
                                    />
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                );
            })}

            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                onClick={handleSubmit}
            >
                Gửi đánh giá
            </Button>
        </Container>
    );
}
