import { useState, useEffect } from 'react';
import ProductItem from './ProductItem';
import { Box, Pagination } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { getProducts } from '../api/api'; 

const ProductList = ({ products: externalProducts }) => {
  const location = useLocation();
  const isHome = location.pathname === "/"; // check có phải trang Home ko

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = isHome ? 8 : 20;

  useEffect(() => {
  const fetchData = async () => {
    try {
      let dataToUse = [];
      if (externalProducts && externalProducts.length > 0) {
        dataToUse = externalProducts;
      } else {
        const data = await getProducts();
        dataToUse = data;
      }

      if (isHome) {
        // Sắp xếp theo quantitySold giảm dần
        dataToUse.sort((a, b) => b.quantitySold - a.quantitySold);
      }

      setProducts(dataToUse);
      setCurrentPage(1); // reset khi đổi danh sách
    } catch (err) {
      console.error("Lỗi khi load sản phẩm:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [externalProducts, isHome]);

  if (loading) {
    return <Box sx={{ textAlign: "center", mt: 5 }}>Đang tải...</Box>;
  }

  // Tính toán phân trang
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = isHome
    ? products.slice(0, productsPerPage) // Trang chủ: luôn lấy 8 sp đầu tiên
    : products.slice(startIndex, endIndex); // Các trang khác: phân trang 20 sp

  const totalPages = isHome ? 1 : Math.ceil(products.length / productsPerPage);

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
        {paginatedProducts.map((p) => (
          <ProductItem key={p._id} product={p} />
        ))}
      </Box>

      {/* Chỉ hiện phân trang nếu không phải trang Home */}
      {!isHome && totalPages > 1 && (
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

export default ProductList;
