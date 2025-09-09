import { Typography, Box } from '@mui/material';
import ROUTES from '../routes';
import { useNavigate } from 'react-router-dom';

const CheckoutItem = ({ item }) => {
    const navigate = useNavigate();

    // Giá cơ bản: ưu tiên variantPrice, sau đó product.price
    const basePrice = item?.variantData?.price ?? item?.product?.price ?? 0;
    const discount = item?.variantData?.discount ?? item?.product?.discount;

    let finalPrice = Number(basePrice);

    if (typeof discount === 'string' && discount.includes('%')) {
        const percent = parseFloat(discount.replace('%', '')) || 0;
        finalPrice = basePrice - (basePrice * percent / 100);
    } else if (!isNaN(discount)) {
        finalPrice = basePrice - Number(discount);
    }
    console.log('item:', item)
    return (
        <Box sx={{
            bgcolor: 'background.paper',
            py: 2,
            px: 1,
            display: 'flex',
            alignItems: 'center',
            '&:hover .image-box': { transform: 'scale(1.05)', transition: 'all 0.3s ease' },
            '&:hover .title': { color: 'primary.main', transition: 'all 0.3s ease' }
        }}>

            <Box sx={{ display: 'flex', width: 1, height: 1 }}>
                <Box
                    onClick={() => navigate(`${ROUTES.PRODUCTS}/${item?.product?._id}`)}
                    sx={{
                        width: { xs: "100px", md: '130px' },
                        height: { xs: "100px", md: '120px' },
                        overflow: 'hidden',
                        borderRadius: 1,
                        cursor: 'pointer',
                    }}>
                    <Box
                        className="image-box"
                        sx={{
                            width: 1,
                            height: 1,
                            backgroundImage: `url(${item?.product?.images?.[0] || 'https://res.cloudinary.com/dpuldllty/image/upload/v1736512130/default_tkzvsa.png'})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover', // hoặc 'cover' nếu muốn fill hết khung
                            backgroundPosition: 'center',
                            borderRadius: 2,
                        }}
                    />

                </Box>

                <Box
                    sx={{
                        px: { xs: 2, md: 3 },
                        width: 0.85,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: {xs:'left', md:'center'},
                        gap: { xs: 0.2, md: 5 },
                        flexDirection: { xs: 'column', md: 'row' }

                    }}>
                    <Box
                        sx={{ width: { xs: 1, md: '250px' }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 1 }}>
                        <Box>
                            <Typography
                                className="title"
                                onClick={() => navigate(`${ROUTES.PRODUCTS}/${item?.product?._id}`)}
                                sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontSize: { xs: '14px', md: '16px' },
                                    cursor: 'pointer',
                                    mb: 0.5
                                }}>
                                {item?.product?.name}
                            </Typography>

                            <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>{item?.variantData?.name}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                            <Typography sx={{ fontWeight: 550, fontSize: '16px', color: 'text.primary', mr: 2 }}>
                                {finalPrice.toLocaleString('vi-VN')} đ
                            </Typography>

                            {/* Hiển thị giá */}
                            {!isNaN(item?.variantData?.price || item?.product?.price) && (
                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                        color: 'text.secondary',
                                        textDecoration: 'line-through',
                                        mr: 2
                                    }}
                                >
                                    {Number(item?.variantData?.price || item?.product?.price).toLocaleString('vi-VN')} đ
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    {/* Quantity control */}
                    <Typography sx={{ fontSize: '14px',  }}>x{item.quantity}</Typography>

                    {/* Thành tiền */}
                    <Typography sx={{ fontSize: '16px', color: 'secondary.light', fontWeight: 550}}>
                        {(Number(finalPrice) * item.quantity).toLocaleString('vi-VN')}đ
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default CheckoutItem;
