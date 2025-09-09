import { Box, Typography, Tabs, Tab, useMediaQuery } from '@mui/material';
import ROUTES from '../routes';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const SideLeftBar = ({ categories = [], items = [], type = 'product' }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const title = type === 'product' ? 'Danh mục sản phẩm' : 'Danh mục bài viết';

    const handleNavigate = (id) => {
        if (type === 'product') {
            navigate(`${ROUTES.PRODUCTSBYCATEGORY}/${id}`);
        } else {
            navigate(`${ROUTES.POSTSBYCATEGORY}/${id}`);
        }
    };

    if (isMobile) {
        return (
            <Box>
                <Tabs
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    aria-label={`${title} tabs`}
                    onChange={(e, value) => handleNavigate(value)}
                >
                    {categories.map((category) => (
                        <Tab key={category._id} label={category.name} value={category._id} />
                    ))}
                </Tabs>
            </Box>
        );
    }

    // Sidebar layout for desktop
    return (
        <Box sx={{ width: 1, flexShrink: 0 }}>
            <Box sx={{ borderRadius: 1 }}>
                <Box
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'primary.light',
                        p: '20px 25px',
                        borderRadius: '8px 0',
                        fontSize: '20px',
                    }}
                >
                    {title}
                </Box>
                <Box
                    sx={{
                        p: '0px 2px',
                        maxHeight: '500px',
                        overflowY: 'auto',
                        borderRadius: '0 8px',
                        bgcolor: 'background.paper',
                    }}
                >
                    {categories.map((category) => {
                        const itemCount =
                            type === 'product'
                                ? items.filter((p) =>
                                    String(p.category?._id || p.category) === String(category._id)
                                ).length
                                : items.filter((p) =>
                                    String(p.postCategory?._id || p.postCategory) === String(category._id)
                                ).length;


                        return (
                            <Box
                                key={category._id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    p: '18px 20px',
                                    cursor: 'pointer',
                                    '&:hover': { color: 'secondary.light' },
                                }}
                                onClick={() => handleNavigate(category._id)}
                            >
                                <Typography>{category.name}</Typography>
                                <Typography>({itemCount})</Typography>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
            <Box
                component="img"
                src="/sideBanner.png"
                sx={{
                    width: 1,
                    height: 'auto',
                    marginTop: '30px',
                }}
            />
        </Box>
    );
};

export default SideLeftBar;
