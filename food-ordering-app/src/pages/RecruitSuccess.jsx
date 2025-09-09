// src/pages/RecruitSuccess.jsx
import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ROUTES from '../routes';

const RecruitSuccess = () => {
    return (
        <Box sx={{ my: { xs: '120px', md: '150px' }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: "center", bgcolor: 'background.paper', width: { xs: 0.9, md: 0.8 }, py: { xs: 15, md: 20 }, px:5, borderRadius: 3 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "green" }} />
                <Typography variant="h4" sx={{ mt: 2 }}>Nộp đơn ứng tuyển thành công!</Typography>
                
                <Typography variant="h6" sx={{ mt: 1 }}>
                    Hãy để ý điện thoại và gmail nhé! Chúng tôi sẽ liên hệ bạn.
                </Typography>
                <Box sx={{ mt: 3 }}>
                    <Button component={Link} to={ROUTES.HOME} variant="contained" sx={{ mr: 2 }}>
                        Về trang chủ
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default RecruitSuccess;
