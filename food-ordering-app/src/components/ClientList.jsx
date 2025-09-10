import { useEffect, useState } from 'react';
import { getClients } from '../api/api';
import ClientItem from './ClientItem';
import { Box, Button } from '@mui/material';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 15;

  useEffect(() => {
    const fetch = async () => {
      const data = await getClients();
      setClients(data);
    };
    fetch();
  }, []);

  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const paginatedItems = clients.slice(
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
    <div className="client-list">
      <Box

        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        gap="90px"
        sx={{
          paddingBottom:'50px',
          padding: '10px',
          margin: '0 auto',
          width: 1
        }}
      >
        {paginatedItems.map((p) => (
          <ClientItem key={p._id} client={p} />

        ))}
      </Box>


      {clients.length > itemsPerPage && (
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

export default ClientList;
