import { Box } from '@mui/material';
import ROUTES from '../routes';
import { useNavigate } from 'react-router-dom';

const PostFoodItem = ({ post }) => {
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                width: { xs: 1, md: '370px' },
                height: { xs: '350px', md: '550px' },
                cursor: 'pointer',
                overflow: 'hidden',
                '&:hover > .image': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s',
                }
            }}
            onClick={() => navigate(`${ROUTES.POSTS}/${post._id}`)}
        >
            <Box className="image"
                sx={{
                    backgroundImage: `url(${post.image ? post.image : 'https://res.cloudinary.com/dpuldllty/image/upload/v1736512130/default_tkzvsa.png'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: 1,
                    height: 1,
                }}
            />
        </Box>
    );
};

export default PostFoodItem;
