import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Typography, Button, Divider, Paper } from "@mui/material";
import Loading from "../components/Loading";
import { getPosition } from "../api/api";
import ROUTES from "../routes";

const PositionDetailPage = ({ showSnackbar }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [position, setPosition] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const positionData = await getPosition(id);
                setPosition(positionData);
            } catch (err) {
                showSnackbar(err.response?.data?.message || "Có lỗi xảy ra", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, showSnackbar]);

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

    return (
        <Box sx={{
            m: { xs: "100px 0", md: "100px 0" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: 'column'
        }}>
            {/* Header */}
            <Box
                sx={{
                    backgroundImage: `url('/bg4.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: { xs: "left", md: "center" },
                    width: 1,
                    height: { xs: "250px", md: "300px", lg: "350px" },
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        bgcolor: "rgba(0, 0, 0, 0.22)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        color="white"
                        sx={{ fontSize: { xs: "30px", md: "60px" }, fontWeight: 700 }}
                    >
                        Tuyển dụng
                    </Typography>
                </Box>
            </Box>
            <Paper sx={{ p: 5, mt:-5, width:{xs:0.9, md:0.8}, zIndex:1, borderRadius:2 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    {position.title}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Địa điểm:</strong> {position.workAddress}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Lương:</strong> {position.salary}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Loại công việc:</strong> {position.type}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Hạn nộp:</strong>{" "}
                    {new Date(position.deadline).toLocaleDateString("vi-VN")}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Mô tả:</strong> {position.description}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Yêu cầu:</strong> {position.requirements}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Quyền lợi:</strong> {position.benefits}
                </Typography>
                <Button
                    variant="contained"
                    sx={{ mt: 2, float:'right' }}
                    onClick={() => navigate(ROUTES.RECRUIT, { state: { positionId: position._id, positionName: position.title } })}
                >
                    Ứng tuyển
                </Button>
            </Paper>
        </Box>
    );
};

export default PositionDetailPage;
