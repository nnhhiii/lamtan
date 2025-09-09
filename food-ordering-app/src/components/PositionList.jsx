import { useState } from "react";
import PositionItem from "./PositionItem"
import { Box, Pagination } from '@mui/material';

const PositionList = ({ positions }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const positionsPerPage = 10;

    // Tính toán phân trang
    const startIndex = (currentPage - 1) * positionsPerPage;
    const endIndex = startIndex + positionsPerPage;
    const paginatedPositions = positions.slice(startIndex, endIndex);

    const totalPages = Math.ceil(positions.length / positionsPerPage);

    return (
        <Box>
            {paginatedPositions.map((p) => (
                <PositionItem key={p._id} pos={p} />
            ))}

            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(e, value) => setCurrentPage(value)}
                        color="primary"
                    />
                </Box>
            )}
        </Box>
    );
}
export default PositionList;