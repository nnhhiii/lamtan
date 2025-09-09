// src/pages/OrdersPage.jsx
import { useEffect, useState } from "react";
import { Box, Tabs, Tab, Typography, Button, Card, CardContent, CardActions, List, ListItem, ListItemText, ListItemAvatar, Avatar } from "@mui/material";
import { getOrdersByStatus, cancelOrder } from "../api/api";
import { Link } from "react-router-dom";
import ROUTES from "../routes";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const ORDER_TABS = [
    { key: "pending", label: "Chờ xác nhận" },
    { key: "confirmed", label: "Đã xác nhận" },
    { key: "shipping", label: "Đang giao" },
    { key: "delivered", label: "Đã giao" },
    { key: "cancelled", label: "Đã hủy" },
];

export default function OrdersPage({ showSnackbar }) {
    const navigate = useNavigate();
    const [tab, setTab] = useState("pending");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrdersByStatus(tab);
                setOrders(data);
            } catch (err) {
                showSnackbar(err.response?.data?.message, "error");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [tab]);

    const getStatusLabel = (status) => {
        const tab = ORDER_TABS.find((t) => t.key === status);
        return tab ? tab.label : status; // fallback nếu không tìm thấy
    };

    const handleCancel = async (id) => {
        setLoading(true);
        try {
            const res = await cancelOrder(id);
            setOrders((prev) => prev.filter((o) => o._id !== id));
            showSnackbar(res.message, "success");
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

    const renderActions = (order) => {
        switch (order.orderStatus) {
            case "pending":
                return (
                    <Button
                        color="error"
                        variant="outlined"
                        onClick={() => handleCancel(order._id)}
                    >
                        Hủy đơn
                    </Button>
                );
            case "confirmed":
                return (
                    <Button variant="outlined" disabled>
                        Đang xử lý
                    </Button>
                );
            case "shipping":
                return (
                    <Button variant="outlined" disabled>
                        Đang giao
                    </Button>
                );
            case "delivered":
                return order.isReviewed ? (
                    <Button
                        component={Link}
                        to={`${ROUTES.PRODUCTS}/${order.items[0].product._id}`}
                        variant="contained"
                    >
                        Mua lại
                    </Button>
                ) : (
                    <Button
                        component={Link}
                        to={`${ROUTES.RATING}/${order._id}/${order.items[0].product._id}`}
                        variant="outlined"
                    >
                        Đánh giá
                    </Button>
                );
            case "cancelled":
                return (
                    <Button
                        component={Link}
                        to={`${ROUTES.PRODUCTS}/${order.items[0].product._id}`}
                        variant="contained"
                    >
                        Mua lại
                    </Button>
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{ my: { xs: '120px', md: '150px' }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ width: { xs: 0.95, md: 650 } }}>
                <Tabs
                    value={tab}
                    onChange={(e, newValue) => setTab(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ mb: 3 }}
                >
                    {ORDER_TABS.map((t) => (
                        <Tab key={t.key} label={t.label} value={t.key} />
                    ))}
                </Tabs>

                {orders.length === 0 ? (
                    <Typography textAlign="center" color="text.secondary">
                        Không có đơn hàng nào
                    </Typography>
                ) : (
                    orders.map((order) => (
                        <Card key={order._id} sx={{ mb: 2, pb: 2 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography sx={{ fontSize: { xs: '17px', md: '19px' } }}>
                                        Mã đơn hàng: {order._id}
                                    </Typography>
                                    <Typography color="error">
                                        {getStatusLabel(order.orderStatus)}
                                    </Typography>
                                </Box>
                                {/* Sản phẩm */}
                                <List>
                                    {order.items.length > 0 && (
                                        <ListItem
                                            key={order.items[0]._id}
                                            sx={{
                                                borderBottom: "1px solid #eee",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => navigate(`${ROUTES.PRODUCTS}/${order.items[0].product?._id}`)}
                                        >
                                            <ListItemAvatar>
                                                <Avatar
                                                    variant="square"
                                                    src={order.items[0].product?.images?.[0] || "/default.png"}
                                                    alt={order.items[0].product?.name}
                                                    sx={{ width: 56, height: 56, mr: 2 }}
                                                />
                                            </ListItemAvatar>

                                            <ListItemText
                                                sx={{ width: 0.75 }}
                                                primary={order.items[0].product?.name || "Sản phẩm"}
                                                secondary={`Số lượng: ${order.items[0].quantity}`}
                                            />

                                            <Typography sx={{ width: 0.3, textAlign: "right" }}>
                                                {(order.items[0].price * order.items[0].quantity).toLocaleString("vi-VN")}đ
                                            </Typography>
                                        </ListItem>
                                    )}
                                    {order.items.length > 1 && (
                                        <Typography variant="body2" color="text.secondary">
                                            và {order.items.length - 1} sản phẩm khác
                                        </Typography>
                                    )}
                                </List>
                                <Box sx={{ justifyContent: 'flex-end', display: 'flex', gap: 1 }}>
                                    <Typography>
                                        Tổng tiền ({order.items.length} sản phẩm):
                                    </Typography>
                                    <Typography sx={{ fontWeight: 550 }}>{order.totalPrice.toLocaleString("vi-VN")} đ</Typography>
                                </Box>
                            </CardContent>
                            <CardActions sx={{ float: 'right' }}>{renderActions(order)} <Button
                                component={Link}
                                to={(`${ROUTES.ORDERDETAIL}/${order._id}`)}
                                variant="outlined"
                            >
                                Xem chi tiết
                            </Button></CardActions>
                        </Card>
                    ))
                )}
            </Box>
        </Box>
    );
}
