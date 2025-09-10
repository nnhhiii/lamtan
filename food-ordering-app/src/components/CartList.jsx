import { useState } from "react";
import CartItem from "./CartItem";
import { Box, Button } from "@mui/material";

const CartList = ({ items, selected, onToggle, onUpdateQty, onUpdateToCart, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 15;

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = items.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <div className="cart-list">
      <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {paginatedItems.map((p) => (
          <CartItem
            key={p._id}
            item={p}
            checked={selected.includes(p._id)}
            onToggle={() => onToggle(p._id)}
            onUpdateQty={onUpdateQty}
            onUpdateToCart={onUpdateToCart}
            onDelete={onDelete} 
          />
        ))}
      </Box>

      {items.length > itemsPerPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          >
            Trước
          </Button>
          <Button
            variant="outlined"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
            disabled={currentPage >= totalPages - 1}
          >
            Sau
          </Button>
        </Box>
      )}
    </div>
  );
};

export default CartList;
