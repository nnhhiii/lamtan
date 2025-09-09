import { Typography, Button, Box } from '@mui/material';
import ROUTES from '../routes';
import { useNavigate, useLocation } from 'react-router-dom';

const PostItem = ({ post }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isInPosts = location.pathname.startsWith(`${ROUTES.POSTSBYCATEGORY}`) || location.pathname.startsWith(`${ROUTES.POSTS}`);

  return (
    <Box
      sx={{
        width: isInPosts ? { xs: 1, md: 0.48, } : { xs: 1, md: '360px' },
        borderRadius: { xs: '20px', md: '30px' },
        boxShadow: 'none',
        alignItems: 'center',
        cursor: 'pointer',
        overflow: 'hidden',
        '&:hover > .text-box .MuiTypography-root:first-of-type': {
          color: 'primary.main',
        },
        '&:hover > .image-box > .MuiBox-root': {
          transform: 'scale(1.05)',
          transition: 'transform 0.3s',
        }
      }}
      onClick={() => navigate(`${ROUTES.POSTS}/${post._id}`)}
    >
      <Box
        className="image-box"
        sx={{
          width: 1,
          height: { xs: '200px', md: '300px' },
          borderRadius: { xs: '20px', md: '30px' },
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            backgroundImage: `url(${
              post.image
                ? post.image
                : 'https://res.cloudinary.com/dpuldllty/image/upload/v1736512130/default_tkzvsa.png'
            })`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: 1,
            height: 1,
            transition: 'transform 0.3s',
          }}
        />
      </Box>
      <Box
        className="text-box"
        sx={{
          padding: { xs: '5px', md: '15px 10px' },
          margin: 0,
          '&:last-child': { paddingBottom: '10px' }
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: { xs: '16px', md: '20px' },
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            margin: 0,
          }}
        >
          {post.name}
        </Typography>
        <Typography
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginBottom: 1,
            mt: -1,
            fontSize: { xs: '14px', md: '16px' },
          }}
          dangerouslySetInnerHTML={{ __html: post.description }}
        />

        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            sx={{
              marginTop: { xs: 0, md: 1 },
              padding: { xs: '10px 15px', md: '10px 50px' },
              borderRadius: '10px',
              fontSize: { xs: '12px', md: '16px' },
            }}
          >
            Chi tiết
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PostItem;
