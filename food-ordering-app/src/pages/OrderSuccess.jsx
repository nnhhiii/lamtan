// src/pages/OrderSuccess.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { getOrderDetail } from "../api/api";
import ROUTES from '../routes';
import Loading from "../components/Loading";

const OrderSuccess = ({ showSnackbar }) => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await getOrderDetail(id);
                setOrder(data);
            } catch (err) {
                showSnackbar(err.response?.data?.message, "error");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ m: { xs: '120px 0', md: '150px 0' }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loading />
            </Box>
        );
    }

    if (!order) {
        return (
            <Box sx={{ my: { xs: '120px', md: '150px' }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ width: { xs: 0.9, md: 600 }, bgcolor: 'background.paper', px: 3, py: 5, borderRadius: 3, textAlign: 'center' }}>
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
        <Box sx={{ my: { xs: '120px', md: '150px' }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: "center", bgcolor: 'background.paper', width: { xs: 0.9, md: 0.8 }, py: { xs: 15, md: 20 }, borderRadius: 3 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "green" }} />
                <Typography variant="h4" sx={{ mt: 2 }}>Đặt hàng thành công!</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
                    {order._id}
                </Typography>
                <Box sx={{ mt: 3 }}>
                    <Button component={Link} to={ROUTES.HOME} variant="contained" sx={{ mr: 2 }}>
                        Về trang chủ
                    </Button>
                    <Button component={Link} to={`${ROUTES.ORDERDETAIL}/${order._id}`} variant="outlined">
                        Xem chi tiết đơn hàng
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default OrderSuccess;
