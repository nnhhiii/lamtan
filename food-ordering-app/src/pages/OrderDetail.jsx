// src/pages/OrderDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Divider, List, ListItem, ListItemText, Chip, ListItemAvatar, Avatar, Button, } from "@mui/material";
import { getOrderDetail } from "../api/api";
import ROUTES from "../routes";
import { useNavigate } from 'react-router-dom';
import Loading from "../components/Loading";

const paymentLabels = {
    cash_on_delivery: "Thanh toán khi nhận hàng",
    bank_transfer_qr: "Chuyển khoản QR",
};

const paymentStatusColors = {
    pending: "warning",
    paid: "success",
    failed: "error",
};

const paymentStatusLabels = {
    pending: "Chưa thanh toán",
    paid: "Đã thanh toán",
    failed: "Thất bại",
};

const orderStatusLabels = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao hàng",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
};

const OrderDetail = ({ showSnackbar }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await getOrderDetail(id);
                setOrder(res);
            } catch (err) {
                showSnackbar(err.response?.data?.message, "error");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id, showSnackbar]);

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
        <Box sx={{ my: { xs: '120px', md: '150px' }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ width: { xs: 0.95, md: 600 }, bgcolor: 'background.paper', p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography sx={{ fontSize: { xs: '17px', md: '19px' }, fontWeight: 600 }}>
                        Chi tiết đơn hàng
                    </Typography>
                    <Typography color="error">
                        {orderStatusLabels[order.orderStatus]}
                    </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />

                {/* Thông tin đơn hàng */}
                <Typography variant="body1">
                    <strong>Mã đơn hàng:</strong> {order._id}
                </Typography>
                <Typography variant="body1">
                    <strong>Địa chỉ giao hàng:</strong> {order.shippingAddress}
                </Typography>
                <Typography variant="body1">
                    <strong>Địa chỉ cụ thể:</strong> {order.shippingAddressDetail}
                </Typography>
                <Typography variant="body1">
                    <strong>Ghi chú:</strong> {order.note || ""}
                </Typography>
                <Typography variant="body1">
                    <strong>Thời gian đặt hàng: </strong>
                    {new Intl.DateTimeFormat("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    }).format(new Date(order.createdAt))}
                </Typography>
                {order.paidTimestamp && (
                    <Typography variant="body1">
                        <strong>Thời gian thanh toán: </strong>
                        {new Intl.DateTimeFormat("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"
                        }).format(new Date(order.paidTimestamp))}
                    </Typography>
                )}

                {order.failedTimestamp && (
                    <Typography variant="body1">
                        <strong>Thời gian thanh toán thất bại: </strong>
                        {new Intl.DateTimeFormat("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"
                        }).format(new Date(order.failedTimestamp))}
                    </Typography>
                )}

                {order.confirmedTimestamp && (
                    <Typography variant="body1">
                        <strong>Thời gian xác nhận: </strong>
                        {new Intl.DateTimeFormat("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"
                        }).format(new Date(order.confirmedTimestamp))}
                    </Typography>
                )}

                {order.shippingTimestamp && (
                    <Typography variant="body1">
                        <strong>Thời gian giao hàng: </strong>
                        {new Intl.DateTimeFormat("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"
                        }).format(new Date(order.shippingTimestamp))}
                    </Typography>
                )}

                {order.deliveredTimestamp && (
                    <Typography variant="body1">
                        <strong>Thời gian giao hàng: </strong>
                        {new Intl.DateTimeFormat("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"
                        }).format(new Date(order.deliveredTimestamp))}
                    </Typography>
                )}

                {order.cancelledTimestamp && (
                    <Typography variant="body1">
                        <strong>Thời gian hủy đơn: </strong>
                        {new Intl.DateTimeFormat("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"
                        }).format(new Date(order.cancelledTimestamp))}
                    </Typography>
                )}


                {/* Trạng thái */}
                <Box sx={{ display: "flex", flexWrap: 'wrap', gap: 2, my: 2 }}>
                    <Chip
                        label={paymentLabels[order.paymentMethod]}
                        color="primary"
                        variant="outlined"
                    />
                    <Chip
                        label={paymentStatusLabels[order.paymentStatus]}
                        color={paymentStatusColors[order.paymentStatus]}
                    />
                </Box>

                {/* Danh sách sản phẩm */}
                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                    Sản phẩm
                </Typography>
                <List>
                    {order.items.map((item, idx) => (
                        <ListItem
                            key={idx}
                            sx={{
                                borderBottom: "1px solid #eee",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate(`${ROUTES.PRODUCTS}/${item.product?._id}`)}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    variant="square"
                                    src={item.product?.images[0] || "/default.png"} // đường dẫn ảnh sản phẩm
                                    alt={item.product?.name}
                                    sx={{ width: 56, height: 56, mr: 2 }}
                                />
                            </ListItemAvatar>

                            <ListItemText sx={{ width: 0.75 }}
                                primary={item.product?.name || "Sản phẩm"}
                                secondary={`Số lượng: ${item.quantity}`}
                            />

                            <Typography sx={{ width: 0.3, textAlign: 'right' }}>
                                {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                            </Typography>
                        </ListItem>
                    ))}
                </List>

                {/* Tổng tiền */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                    <Typography variant="h6">Tổng thanh toán</Typography>
                    <Typography variant="h6" color="primary">
                        {order.totalPrice.toLocaleString("vi-VN")} đ
                    </Typography>
                </Box>

                {/* Nút quay lại */}
                <Box sx={{ mt: 3, float: 'right' }}>
                    <Button component={Link} to={ROUTES.HOME} variant="contained">
                        Về trang chủ
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default OrderDetail;
