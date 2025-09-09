import { Box, Typography } from "@mui/material";
import Partner from '../components/Partner';
import Client from '../components/Client';
import Milestone from '../components/Milestone';

const AboutPage = () => {
    return (
        <>
        <Box
                sx={{
                    backgroundImage: `url('bg3.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: { xs: 'left', md: 'center' },
                    width: 1,
                    height: { xs: '350px', md: '400px', lg: '650px' },
                    mb:5,
                    mt:'100px'
                }}
            >
                {/* Lớp overlay màu đen mờ */}
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        bgcolor: 'rgba(0, 0, 0, 0.07)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        color="white"
                        sx={{ fontSize: { xs: '30px', md: '60px' }, fontWeight: 700 }}
                    >
                        Giới thiệu
                    </Typography>
                </Box>
            </Box>
        <Box
            sx={{
                width: 1,
                bgcolor: 'background.paper',
                py: {xs:5, md:15},
                mb: 5,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
        
            <Box sx={{ width: { xs: 0.9, md: 0.7 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 7, md:0 } }}>
                    <Box sx={{ width: { xs: 1, md: 0.5 } }}>
                        <Typography gutterBottom
                            sx={{
                                textAlign: { xs: 'center', md: 'left' },
                                fontSize: { xs: '25px', md: '40px' },
                                letterSpacing: { xs: 0, md: 1 },
                                fontWeight: 700,
                            }}>
                            Câu chuyện Lam Tân
                        </Typography>
                        <Typography sx={{ textAlign: { xs: 'justify', lg: 'left' }, fontSize: { xs: '16px', md: '18px' } }}> Thành lập từ năm 2004, Công ty Lam Tân chuyên nhập khẩu và phân phối các mặt hàng thực phẩm chất lượng cao. Chúng tôi mang đến sự đa dạng về sản phẩm, từ khoai tây đông lạnh, phô mai, thịt, chế phẩm từ sữa, gia vị cho đến nước uống và nguyên liệu thực phẩm.</Typography>
                    </Box>
                    <Box
                        sx={{
                            backgroundImage: `url('pasta1.jpg')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'right',
                            boxShadow: '50px -50px 0 lightgray',
                            width: { xs: 0.85, md: 0.33 },
                            height: '500px',
                        }}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: { xs: 'column-reverse', md: 'row' }, gap: { xs: 3, md: 0 }, mt:10, mb: { xs: 15, md: 0 } }}>
                    <Box sx={{ position: 'relative', width: { xs: 1, md: 0.33 }, top: { xs: 0, md: -200 } }}>
                        <Box
                            sx={{
                                backgroundImage: `url('pizza.jpg')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: { xs: 0.8, md: 1 },
                                height: '500px',
                            }}
                        />
                        <Box
                            sx={{
                                backgroundImage: `url('pasta.jpg')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: { xs: 0.8, md: 0.9 },
                                height: '230px',
                                position: 'absolute',
                                bottom: '-50px',
                                left: '100px',
                                border: '10px solid white'
                            }}
                        />
                    </Box>
                    <Box sx={{ width: { xs: 1, md: 0.5 } }}>
                        <Typography gutterBottom
                            sx={{
                                textAlign: { xs: 'center', md: 'left' },
                                fontSize: { xs: '25px', md: '40px' },
                                letterSpacing: { xs: 0, md: 1 },
                                fontWeight: 700,
                            }}>
                            Chúng tôi là ai
                        </Typography>
                        <Typography sx={{ textAlign: { xs: 'justify', lg: 'left' }, fontSize: { xs: '16px', md: '18px' } }}>
                            Với hơn 18 năm kinh nghiệm trong ngành, Lam Tân tự hào là đối tác kinh doanh uy tín, luôn đặt lợi ích của khách hàng và nhà cung cấp lên hàng đầu. Đội ngũ nhân sự được đào tạo chuyên nghiệp, tận tâm, là nền tảng giúp chúng tôi không ngừng phát triển.
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 0 } }}>
                    <Box sx={{ width: { xs: 1, md: 0.5 } }}>
                        <Typography gutterBottom
                            sx={{
                                textAlign: { xs: 'center', md: 'left' },
                                fontSize: { xs: '25px', md: '40px' },
                                letterSpacing: { xs: 0, md: 1 },
                                fontWeight: 700,
                            }}>
                            Cam kết của chúng tôi
                        </Typography>
                        <Typography sx={{ textAlign: { xs: 'justify', lg: 'left' }, fontSize: { xs: '16px', md: '18px' } }}>
                            Lam Tân liên tục đầu tư vào cơ sở hạ tầng – từ phương tiện vận chuyển, kho lạnh đến hệ thống phân phối hiện đại – nhằm đảm bảo chất lượng sản phẩm và dịch vụ tốt nhất. Chúng tôi cam kết đem đến những giải pháp thực phẩm an toàn, tin cậy và bền vững cho thị trường.
                        </Typography>
                    </Box>
                    <Box sx={{ width: { xs: 1, md: 0.4 }, display: 'flex', gap: { xs: 2, md: 3 } }}>
                        <Box sx={{ position: 'relative', width: 1, height: '350px', }}>
                            <Box
                                sx={{
                                    backgroundImage: `url('oliu.jpg')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    width: 1,
                                    height: 1,
                                }}
                            />
                        </Box>
                        <Box sx={{ position: 'relative', width: 1, height: '350px', }}>
                            <Box
                                sx={{
                                    backgroundImage: `url('tomato.jpg')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    width: 1,
                                    height: 1,
                                    position: 'absolute',
                                    bottom: { xs: -50, md: 100 }
                                }}
                            />
                        </Box>
                    </Box>

                </Box>
            </Box>

            
        </Box>
        <Milestone />
            <Partner />
            <Client />
            </>
    );
};

export default AboutPage;
