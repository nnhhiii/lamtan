import React, { useEffect, useState } from 'react';
import { getPartners } from '../api/api';
import PartnerItem from './PartnerItem';
import { Box, Button } from '@mui/material';

const PartnerList = () => {
  const [partners, setPartners] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 15;

  useEffect(() => {
    const fetch = async () => {
      const data = await getPartners();
      setPartners(data);
    };
    fetch();
  }, []);

  const totalPages = Math.ceil(partners.length / itemsPerPage);
  const paginatedItems = partners.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="partner-list">
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        gap="90px"
        sx={{
          padding: '20px',
          margin: '0 auto',
          width: 1,
        }}
      >
        {paginatedItems.map((p) => (
          <PartnerItem key={p._id} partner={p} />
        ))}
      </Box>

      {partners.length > itemsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
          <Button variant="outlined" onClick={handlePrev} disabled={currentPage === 0}>
            Trước
          </Button>
          <Button variant="outlined" onClick={handleNext} disabled={currentPage >= totalPages - 1}>
            Sau
          </Button>
        </Box>
      )}
    </div>
  );
};

export default PartnerList;
