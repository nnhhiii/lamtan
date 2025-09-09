import { Typography, Box } from '@mui/material';
import ROUTES from '../routes';
import { useNavigate } from 'react-router-dom';

const CategoryItem = ({ category }) => {
    const navigate = useNavigate();
    return (
        <Box
            onClick={() => navigate(`${ROUTES.PRODUCTSBYCATEGORY}/${category._id}`)}
            sx={{
                width: { xs: '100px', md: '130px' },
                height: { xs: '100px', md: '130px' },
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'primary.light',
                    transition: 'all 0.5s ease',
                    boxShadow: '0 5px 10px gray'
                },

            }}>
            <Box
                sx={{
                    width: '50px',
                    height: '50px',
                    backgroundImage: `url(${category.image ? category.image : 'https://res.cloudinary.com/dpuldllty/image/upload/v1736512130/default_tkzvsa.png'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />

            <Typography
                gutterBottom
                component="div"
                sx={{
                    marginTop: '8px',
                    maxWidth: '50%',
                    fontSize: { xs: '12px', md: '14px' },
                    textAlign: 'center',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {category.name}
            </Typography>
        </Box>

    );
};

export default CategoryItem;
