import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../routes';

const navItems = [
    { label: 'Trang chủ', path: ROUTES.HOME },
    { label: 'Giới thiệu', path: ROUTES.ABOUT },
    { label: 'Sản phẩm', path: ROUTES.PRODUCTS },
    { label: 'Bài viết', path: ROUTES.POSTS },
    { label: 'Tuyển dụng', path: ROUTES.POSITIONS },
];
const navItem1s = [
    { label: 'Chính sách bán hàng', path: "#1" },
    { label: 'Chính sách thanh toán', path: "#2" },
    { label: 'Chính sách đổi trả', path: "#3" },
    { label: 'Chính sách vận chuyển', path: "#4" },
    { label: 'Chính sách bảo mật', path: "#5" },
];

const Footer = ({ aboutData }) => {
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                width: '100%',
                bgcolor: 'background.paper',
                padding: '50px 100px',
            }}
        >
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-around',
                width: '100%',
                flexWrap: 'wrap',
                gap: 4

            }}>
                <Box>
                    <Box
                        component="img"
                        sx={{
                            width: '140px',
                        }}
                        alt="Logo"
                        src={aboutData?.logo}
                    />

                    <Box sx={{ display: 'flex' }}>
                        <Box
                            component="a"
                            href={aboutData?.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Box
                                component="img"
                                sx={{
                                    width: '40px',
                                }}
                                alt="Facebook Logo"
                                src="/fb.png"
                            />
                        </Box>
                        <Box
                            component="a"
                            href={`https://zalo.me/${aboutData?.zalo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Box
                                component="img"
                                sx={{
                                    width: '40px',
                                    ml: 1
                                }}
                                alt="Zalo Logo"
                                src="/zalo.png"
                            />
                        </Box>
                    </Box>
                </Box>



                <Box>
                    <Typography gutterBottom
                        sx={{
                            fontWeight: 600,
                            color: 'text.third',
                            textAlign: { xs: 'center', md: 'left', xl: 'left' },

                        }}>
                        Về {aboutData?.name}
                    </Typography>
                    {navItems.map((item) => (
                        <Typography
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            sx={{
                                cursor: 'pointer',
                                mb: 1,
                                '&:hover': {
                                    color: 'text.main',
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            {item.label}
                        </Typography>
                    ))}
                </Box>
                <Box>
                    <Typography gutterBottom
                        sx={{
                            fontWeight: 600,
                            color: 'text.third',
                            textAlign: { xs: 'center', md: 'left', xl: 'left' },
                        }}>
                        Chính sách
                    </Typography>
                    {navItem1s.map((item) => (
                        <Typography
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            sx={{
                                cursor: 'pointer',
                                mb: 1,
                                '&:hover': {
                                    color: 'text.main',
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            {item.label}
                        </Typography>
                    ))}
                </Box>
                <Box>
                    <Typography gutterBottom
                        sx={{
                            fontWeight: 600,
                            color: 'text.third',
                            textAlign: { xs: 'center', md: 'left' },
                            textTransform: 'uppercase', // IN HOA TOÀN BỘ
                        }}>
                        CÔNG TY TNHH TM - DV {aboutData?.name}
                    </Typography>
                    <Typography
                        gutterBottom
                        sx={{
                            color: 'text.main',
                            textAlign: { xs: 'center', md: 'left' },
                        }}
                    >
                        Địa chỉ: {aboutData?.address?.[0]}
                    </Typography>

                    {aboutData?.address?.slice(1).map((branch, index, arr) => (
                        <Typography
                            key={index}
                            sx={{
                                textAlign: { xs: 'center', md: 'left' },
                            }}
                        >
                            {arr.length > 1 ? `Chi nhánh ${index + 1}:` : "Chi nhánh:"} {branch}
                        </Typography>
                    ))}


                    <Typography gutterBottom
                        sx={{
                            fontWeight: 600,
                            color: 'text.third',
                            textAlign: { xs: 'center', md: 'left' },
                            mt: 1
                        }}>
                        Hotline: {aboutData?.hotline[0]}
                    </Typography>
                    <Box
                        component="img"
                        sx={{
                            width: '250px',
                            height: '90px',
                            mt: 3
                        }}
                        alt="Bo Cong Thuong"
                        src="/bocongthuong.webp"
                    />
                </Box>
            </Box>

        </Box>

    );
};

export default Footer;
