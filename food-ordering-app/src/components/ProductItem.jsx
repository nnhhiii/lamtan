import { CardMedia, Typography, Box } from '@mui/material';
import ROUTES from '../routes';
import { useNavigate } from 'react-router-dom';
import RenderStars from './RenderStars';

const ProductItem = ({ product }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: { xs: '47%', md: '23.5%' },
        minWidth:{ md:'260px'},
        height: { xs: '360px', md: '400px' },
        cursor: 'pointer',
        '&:hover .card-media': {
          transform: 'scale(1.05)',
        },
        '&:hover .title': {
          color: 'primary.main',
          transition: 'all 0.3s ease'
        },

      }}
      onClick={() => navigate(`${ROUTES.PRODUCTS}/${product._id}`)}
    >
      <Box className="image-box"
        sx={{
          height: { xs: "190px", md: '270px' },
          overflow: 'hidden',
          borderRadius: { xs: 1, md: 1 },
        }}>
        <CardMedia
          className="card-media"
          component="img"
          image={product.images && product.images.length > 0 ? product.images[0] : 'https://res.cloudinary.com/dpuldllty/image/upload/v1736512130/default_tkzvsa.png'}
          alt={product.name}
          sx={{ transition: 'transform 0.3s', height: 1 }}
        />
      </Box>
      <Box sx={{ padding: { xs: '10px 0', md: '5px 0' }, margin: 0, '&:last-child': { paddingBottom: '10px' }, }}>
        <Typography
          className="title"
          sx={{
            fontWeight: 500,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: { xs: '14px', md: '18px' },
          }}>
          {product.name}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box>
              <Typography sx={{ fontWeight: 550, fontSize: '20px', color: 'secondary.light', mr: 2 }}>
                {(() => {
                  const price = Number(product?.price) || 0;
                  const discount = product?.discount;

                  if (typeof discount === 'string' && discount.includes('%')) {
                    // Lấy số % từ chuỗi
                    const percent = parseFloat(discount.replace('%', '')) || 0;
                    const finalPrice = price - (price * percent / 100);
                    return `${finalPrice.toLocaleString('vi-VN')} đ`;
                  }

                  if (!isNaN(discount)) {
                    // Giảm theo số tiền
                    const finalPrice = price - Number(discount);
                    return `${finalPrice.toLocaleString('vi-VN')} đ`;
                  }

                  return `${price.toLocaleString('vi-VN')} đ`;
                })()}
              </Typography>
              {!isNaN(product?.price) && (
                <Typography
                  sx={{
                    fontSize: '16px',
                    color: 'text.secondary',
                    textDecoration: 'line-through',

                  }}
                >
                  {Number(product?.price).toLocaleString('vi-VN')} đ
                </Typography>
              )}
            </Box>

            {product?.discount != 0 && (
              <Typography
                sx={{
                  fontWeight: 550,
                  fontSize: '16px',
                  color: 'white',
                  bgcolor: '#DA2032',
                  p: 0.5,
                  borderRadius: 2
                }}
              >
                {(() => {
                  const discount = product?.discount;

                  // Nếu là string và chứa '%' => giữ nguyên nhưng vẫn thêm dấu '-'
                  if (typeof discount === 'string' && discount.includes('%')) {
                    return `-${discount}`;
                  }

                  // Nếu là số và > 999 => format VN
                  if (!isNaN(discount) && Number(discount) > 999) {
                    return `-${Number(discount).toLocaleString('vi-VN')}đ`;
                  }

                  // Các trường hợp còn lại
                  return `-${discount}đ`;
                })()}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'bottom', mb: 1 }}>
          {product.averageRating !== 0 && (
            <Box sx={{ display: 'flex' }}>
              <RenderStars rating={product?.averageRating} />
              <Typography sx={{ color: 'text.secondary', fontSize: '13px', lineHeight: 2.1, ml: 0.5, mr: 0.5 }}>
                ({product?.totalRatings})
              </Typography>
              <Typography sx={{ display: { xs: 'none', md: 'flex' }, color: 'text.secondary', fontSize: '13px', lineHeight: 2.1, mr:1 }}>
                |
              </Typography>
            </Box>
          )}

          <Typography sx={{ color: 'text.secondary', fontSize: '13px', lineHeight: 2.1 }}>
            {product?.quantitySold || 0} đã bán
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductItem;
