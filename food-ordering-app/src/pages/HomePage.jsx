import ProductList from '../components/ProductList';
import CategoryList from '../components/CategoryList';
import PostList from '../components/PostList';
import PostFoodList from '../components/PostFoodList';
import { Box, Typography, Button } from '@mui/material';
import ROUTES from '../routes';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getPostCategories } from '../api/api';
import { useEffect, useState } from 'react';
import Partner from '../components/Partner';
import Client from '../components/Client';
import Milestone from '../components/Milestone';

const Home = ({ aboutData }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getPostCategories();
        if (res.length > 1) {
          setCategories(res)
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };
    fetchPosts();
  }, []);
  return (
    <>
      <Box
        sx={{
          backgroundImage: `url('bg2.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: { xs: 'left', md: 'center' },
          backgroundAttachment: 'fixed',
          width: 1,
          height: { xs: '350px', md: '400px', lg: '650px' },
          marginTop: '100px'
        }}
      >
        {/* Lớp overlay màu đen mờ */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0, 0, 0, 0.18)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            color="white"
            sx={{ fontSize: { xs: '30px', md: '60px' }, fontWeight: 800 }}
          >
            WELCOM TO LAM TAN
          </Typography>
        </Box>
      </Box>

      {/* About */}
      <Box sx={{ my: { xs: '50px', md: '100px' }, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ width: { xs: 1, md: 0.8 }, bgcolor: 'background.paper', height: { xs: 1, md: '600px' }, borderRadius: { xs: 0, md: 2 }, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
            <Box sx={{ width: { xs: 1, md: 0.5 }, p: { xs: 3, md: 8 } }}>
              <Typography gutterBottom
                sx={{
                  textAlign: { xs: 'center', md: 'left' },
                  fontSize: { xs: '12px', md: '16px' },
                  fontWeight: 700,
                  color: 'primary.main'
                }}>
                Giới thiệu
              </Typography>
              <Typography gutterBottom
                sx={{
                  textAlign: { xs: 'center', md: 'left' },
                  fontSize: { xs: '25px', md: '40px' },
                  letterSpacing: { xs: 0, md: 1 },
                  fontWeight: 700,
                }}>
                Về {aboutData?.name}
              </Typography>
              <Typography
                gutterBottom
                sx={{
                  textAlign: { xs: 'justify', md: 'left' },
                  fontSize: { xs: '16px', md: '18px' },
                  whiteSpace: 'pre-line', // giữ xuống dòng
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 11,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {aboutData?.description || ''}
              </Typography>

              <Typography gutterBottom
                sx={{
                  textAlign: { xs: 'center', md: 'left' },
                  fontSize: { xs: '16px', md: '17px' },
                  textDecoration: 'underline',
                  mt: 5,
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' },
                }}
                onClick={() => navigate(ROUTES.ABOUT)}
              >
                Xem thêm
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundImage: `url('pizza.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: { xs: 1, md: 0.5 },
                height: { xs: '350px', md: '600px' },
              }}
            />
          </Box>
        </Box>
      </Box>


      <Milestone />
      <Partner />
      <Client />

      {/* Products */}
      <Box
        sx={{
          width: 1,
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          mb: 5
        }}>
        <Box sx={{
          width: { xs: 0.9, md: 0.8 }, py: 3, justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: { xs: '12px', md: '16px' },
              fontWeight: 700,
              color: 'primary.main'
            }}>
            Sản phẩm
          </Typography>
          <Typography gutterBottom
            sx={{
              textAlign: 'center',
              fontSize: { xs: '25px', md: '40px' },
              letterSpacing: { xs: 0, md: 1 },
              fontWeight: 700,
              width: 0.8
            }}>
            Những mặt hàng nổi bật của Lam Tân
          </Typography>
          <Typography gutterBottom sx={{ textAlign: { xs: 'justify', md: 'center' }, fontSize: { xs: '16px', md: '18px' } }}>
            Chúng tôi chuyên cung các cấp sản phẩm đông lạnh như: Khoai tây – Phô mai – Thịt (gà, bò, heo, sườn, ba rọi, ba chỉ bò…) – Trái cây đông lạnh (dâu, việt quất, mâm xôi, bắp hạt, …). Ngoài ra còn có dòng hàng: mì Ý, nui, sốt cà pizza, dầu oliu – Các loại nước ngọt và nguyên liệu pha chế – Mặt hàng khô như gạo, trứng, gia vị…
          </Typography>

          <CategoryList />

          <ProductList />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 2, md: 5 } }}>
            <Button variant='outlined' sx={{ p: { xs: '10px 20px', md: '10px 45px' }, fontSize: { xs: '12px', md: '14px' }, }} onClick={() => navigate(ROUTES.PRODUCTS)}> Xem thêm</Button>

          </Box>
        </Box>
      </Box>

      {/* Why choose us */}
      <Box
        sx={{
          backgroundImage: `url('pasta.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          width: 1,
          height: { xs: '200px', md: '300px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 5
        }}
      >
        <Box sx={{
          width: { xs: 0.8, md: 0.4 },
          height: 0.9,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: { xs: '12px', md: '16px' },
              fontWeight: 700,
              color: 'white'
            }}>
            Tại sao nên chọn Lam Tân
          </Typography>
          <Typography gutterBottom
            sx={{
              textAlign: 'center',
              fontSize: { xs: '23px', md: '40px' },
              letterSpacing: { xs: 0, md: 1 },
              fontWeight: 700,
              color: 'white',
            }}>
            Hãy đặt hàng ngay hôm nay để nhận ưu đãi mới nhất
          </Typography>
          <Button variant='contained' sx={{ p: "12px 50px", borderRadius: 1, boxShadow: 'none' }} onClick={() => navigate(ROUTES.PRODUCTS)}>Mua ngay</Button>
        </Box>
      </Box>

      <Box sx={{
        bgcolor: 'background.paper',
        width: 1,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column', mb: 5, py: 8
      }}>
        <Box sx={{
          width: { xs: 0.9, md: 0.8 }, justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between' }}>
            <Box sx={{ width: { xs: 1, md: 0.35 } }}>
              <Typography gutterBottom
                sx={{
                  textAlign: { xs: 'center', md: 'left' },
                  fontSize: { xs: '12px', md: '16px' },
                  fontWeight: 700,
                  color: 'primary.main'
                }}>
                Bài viết - Món ăn ngon
              </Typography>
              <Typography gutterBottom
                sx={{
                  textAlign: { xs: 'center', md: 'left' },
                  fontSize: { xs: '25px', md: '40px' },
                  fontWeight: 700,
                }}>
                Khám phá những món ăn ngon từ các sản phẩm của Lam Tân
              </Typography>
            </Box>
            <Box sx={{ width: { xs: 1, md: 0.6 }, display: 'flex', alignItems: 'center' }}>
              <Box>
                <Typography gutterBottom sx={{ textAlign: { xs: 'justify', md: 'left' }, fontSize: { xs: '16px', md: '18px' } }}>
                  Đa dạng về sản phẩm,  chuyên nhập khẩu và phân phối các mặt hàng thực phẩm chất lượng cao. Các sản phẩm chính của chúng tôi là khoai tây đông lạnh, phô-mai, thịt đông lạnh, các chế phẩm từ sữa, gia vị, các loại nước uống và nguyên liệu thực phẩm…
                </Typography>
                <Button variant='outlined' sx={{ borderWidth: "3px", borderRadius: 3, p: "12px 50px", mt: 3, float: { xs: 'right', md: 'left' } }}
                  onClick={() => navigate(`${ROUTES.POSTSBYCATEGORY}/${categories[2]._id}`)}
                >
                  <ArrowForwardIcon sx={{ scale: 1.5 }} />
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 5, width: 1 }}>
          <PostFoodList />
        </Box>

      </Box>

      <Box sx={{ bgcolor: 'background.paper', mb: 5 }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: { xs: '30px 20px', md: '30px 50px' } }}>
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: { xs: '12px', md: '16px' },
              fontWeight: 700,
              color: 'primary.main'
            }}>
            Bài viết
          </Typography>
          <Typography gutterBottom
            sx={{
              textAlign: 'center',
              fontSize: { xs: '25px', md: '40px' },
              letterSpacing: { xs: 0, md: 1 },
              fontWeight: 700,
              width: { xs: 0.8, md: 0.4 }
            }}>
            Những bài viết gần đây của Lam Tân
          </Typography>
        </Box>
        <PostList />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, pb: '50px' }}>
          <Button variant='outlined' sx={{ p: { xs: '10px 20px', md: '10px 45px' }, fontSize: { xs: '12px', md: '14px' }, }} onClick={() => navigate(ROUTES.POSTS)}> Xem thêm</Button>
        </Box>
      </Box>


    </>
  );

};
export default Home;
