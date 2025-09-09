import {
    Box,
    Typography,
    Button,
    Paper,
    Divider,
} from "@mui/material";
import ROUTES from "../routes";
import { useNavigate } from "react-router-dom";

const PositionItem = ({pos}) => {
    const navigate = useNavigate();
    return (
        <Paper
            key={pos._id}
            onClick={() => navigate(`${ROUTES.POSITIONS}/${pos._id}`)}
            sx={{ p: 2, mb: 2, boxShadow: '0 1px 3px lightgray', cursor: 'pointer' }}
        >
            <Typography variant="h6">{pos.title}</Typography>
            <Typography variant="body2" color="text.secondary">
                Địa chỉ: {pos.workAddress} | {pos.type} | Lương: {pos.salary}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
                Hạn nộp: {new Date(pos.deadline).toLocaleDateString("vi-VN")}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: "flex", justifyContent: 'right' }}>
                <Button
                    variant="contained"
                    onClick={(e) => {
                        e.stopPropagation(); // ⛔ không cho chạy onClick của Paper
                        navigate(ROUTES.RECRUIT);
                    }}
                >
                    Ứng tuyển
                </Button>
            </Box>
        </Paper>
    )
}
export default PositionItem;