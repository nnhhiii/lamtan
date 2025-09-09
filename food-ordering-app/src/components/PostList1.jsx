import { useState } from 'react';
import PostItem from './PostItem';
import { Box, Pagination } from '@mui/material';

const PostList1 = ({ posts = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Tính toán phân trang
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: "wrap",
          gap: { xs: 1, md: 2 },
          justifyContent: { xs: 'space-evenly', md: 'flex-start' },
        }}
      >
        {paginatedPosts.map((p) => (
          <PostItem key={p._id} post={p} />
        ))}
      </Box>

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
};

export default PostList1;
