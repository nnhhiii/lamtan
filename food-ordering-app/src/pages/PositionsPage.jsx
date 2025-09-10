import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Loading from "../components/Loading";
import { getPositions } from "../api/api";
import PositionList from "../components/PositionList";

const PositionsPage = ({ showSnackbar }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [positions, setPositions] = useState([]);
    const [filteredPositions, setFilteredPositions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const positionsData = await getPositions();
                setPositions(positionsData);
                setFilteredPositions(positionsData);
            } catch (err) {
                showSnackbar(err.response?.data?.message || "Có lỗi xảy ra", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [showSnackbar]);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredPositions(positions);
        } else {
            const lowerSearch = searchTerm.toLowerCase();
            const filtered = positions.filter(
                (p) =>
                    p.title.toLowerCase().includes(lowerSearch) ||
                    p.description?.toLowerCase().includes(lowerSearch)
            );
            setFilteredPositions(filtered);
        }
    }, [searchTerm, positions]);

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
        <Box
            sx={{
                width: 1,
                py: { xs: "100px", md: "100px" },
                mb: 5,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    backgroundImage: `url('bg5.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: { xs: "left", md: "center" },
                    width: 1,
                    height: { xs: "350px", md: "400px", lg: "650px" },
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        bgcolor: "rgba(0, 0, 0, 0.07)",
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
            <Box sx={{ width: { xs: 0.9, md: 0.5 } }}>
                {/* Search */}
                <Box sx={{ width: 1, my: 3 }}>
                    <TextField
                        placeholder="Tìm công việc..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="small"
                        fullWidth
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </Box>

                {/* Danh sách việc làm */}
                <PositionList positions={filteredPositions}/>
            </Box>
        </Box>
    );
};

export default PositionsPage;
