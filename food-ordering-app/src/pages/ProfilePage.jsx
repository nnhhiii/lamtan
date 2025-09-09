// src/pages/ProfilePage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, Avatar, Paper, Divider } from "@mui/material";
import Loading from "../components/Loading";
import ROUTES from "../routes";

const ProfilePage = ({ userData }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userData) {
            setLoading(false);
        } else {
            setLoading(false); // không có userData cũng tắt loading
        }
    }, [userData]);

    if (loading) {
        return (
            <Box
                sx={{
                    m: { xs: "120px 0", md: "150px 0" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Loading />
            </Box>
        );
    }

    if (!userData) {
        return (
            <Box sx={{ textAlign: "center", mt: 5 }}>
                <Typography variant="h6" color="error">
                    Không tìm thấy người dùng
                </Typography>
                <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
                    Về trang chủ
                </Button>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                maxWidth: 600,
                mx: "auto",
                my: { xs: 10, md: 15 },
                p: 3,
            }}
        >
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <Avatar
                        src={userData.user.image || "/default-avatar.png"}
                        alt={userData.user.username}
                        sx={{ width: 100, height: 100 }}
                    />
                    <Typography variant="h5" fontWeight="bold">
                        {userData.user.username}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {userData.user.email}
                    </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography><strong>Số điện thoại:</strong> {userData.user.phone || ""}</Typography>
                    <Typography><strong>Địa chỉ:</strong> {userData.user.address || ""}</Typography>
                    <Typography><strong>Địa chỉ cụ thể (số nhà, hẻm,...):</strong> {userData.user.addressDetail || ""}</Typography>
                    <Typography><strong>Tạo lúc:</strong>{" "}
                        {new Intl.DateTimeFormat("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        }).format(new Date(userData.user.createdAt))}
                    </Typography>
                    <Typography><strong>Cập nhật lúc:</strong>{" "}
                        {new Intl.DateTimeFormat("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        }).format(new Date(userData.user.updatedAt))}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Button variant="contained" color="primary" component={Link} to={ROUTES.EDITPROFILE}>
                        Chỉnh sửa hồ sơ
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default ProfilePage;
