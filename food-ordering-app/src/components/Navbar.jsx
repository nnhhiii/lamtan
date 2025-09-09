import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import { Badge } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useColorMode } from "../constants/Theme";
import Grow from '@mui/material/Grow';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { getCategories } from '../api/api';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ROUTES from '../routes';


const pages = [
    { name: 'Trang chủ', path: ROUTES.HOME },
    {
        name: 'Sản phẩm',
        submenu: 'dynamic' // sẽ gọi API
    },
    {
        name: 'Về chúng tôi',
        submenu: [
            { name: 'Giới thiệu', path: ROUTES.ABOUT },
            { name: 'Bài viết', path: ROUTES.POSTS }
        ]
    },
    { name: 'Tuyển dụng', path: ROUTES.POSITIONS },
];



const NavBar = ({ cartItemCount, userData, aboutData }) => {
    const navigate = useNavigate();
    const [anchorElNavMenu, setAnchorElNavMenu] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [submenuItems, setSubmenuItems] = useState([]);
    const [openMenu, setOpenMenu] = useState('');
    const [openSubMenus, setOpenSubMenus] = useState({});

    const { setMode, mode } = useColorMode();
    const [systemMode, setSystemMode] = useState('light');

    const settings = userData
        ? [
            { name: 'Trang cá nhân', path: '/profile' },
            { name: 'Lịch sử đặt hàng', path: ROUTES.ORDERS },
            { name: 'Đăng xuất', path: ROUTES.LOGOUT }
        ]
        : [
            { name: 'Đăng nhập', path: ROUTES.LOGIN },
            { name: 'Đăng ký', path: ROUTES.REGISTER }
        ];


    // Lấy theme hệ thống nếu mode === 'system'
    useEffect(() => {
        if (mode === 'system') {
            const media = window.matchMedia('(prefers-color-scheme: dark)');
            const updateSystemMode = () => {
                setSystemMode(media.matches ? 'dark' : 'light');
            };
            updateSystemMode();
            media.addEventListener('change', updateSystemMode);
            return () => media.removeEventListener('change', updateSystemMode);
        }
    }, [mode]);

    const isDark = mode === 'dark' || (mode === 'system' && systemMode === 'dark');

    //Open
    const handleOpenNavMenu = (event) => {
        setAnchorElNavMenu(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleMenuClick = async (event, page, index) => {
        setAnchorEl(event.currentTarget);
        setOpenMenu(index);

        if (page.submenu === 'dynamic') {
            try {
                const data = await getCategories(); // gọi API categories
                setSubmenuItems(data.map(item => ({
                    name: item.name,
                    path: `${ROUTES.PRODUCTSBYCATEGORY}/${item.slug || item.id}`
                })));
            } catch (err) {
                console.error('Lỗi khi gọi danh mục:', err);
                setSubmenuItems([]);
            }
        } else if (Array.isArray(page.submenu)) {
            setSubmenuItems(page.submenu);
        } else {
            setSubmenuItems([]);
        }
    };
    const toggleSubMenu = (name) => {
        setOpenSubMenus((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };


    // Close
    const handleCloseNavMenu = () => {
        setAnchorElNavMenu(null);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setOpenMenu('');
        setSubmenuItems([]);
    };


    //Click
    const handleNavMenuItemClick = (path) => {
        navigate(path);
        handleCloseNavMenu();
        handleMenuClose();
    };
    const handleUserMenuItemClick = (path) => {
        navigate(path);
        handleCloseUserMenu();
    };
    const handleCart = () => {
        navigate('/cart'); // Chuyển đến trang giỏ hàng
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: "secondary.main",
                color: "text.primary",
                height: "100px",
                display: 'flex',
                boxShadow: '0 1px 5px #0000001f'
            }}
        >
            <Box
                component="img"
                sx={{
                    height: 100,
                    position: 'absolute',
                    left: { xs: '50%', md: '1%', lg: '10%' },
                    transform: { xs: 'translateX(-50%)', md: 'translateX(0%)' },
                    cursor: 'pointer'
                }}
                alt="Logo"
                src={aboutData?.logo}
                onClick={() => navigate(ROUTES.HOME)}
            />

            <Box sx={{ position: 'absolute', right: 0, display: 'flex', alignItems: 'center', height: 1 }}>
                <Box
                    sx={{
                        flexGrow: 1,
                        display: { xs: 'none', md: 'flex' },
                        mr: 4
                    }}
                >
                    {pages.map((page, index) => (
                        <Box
                            key={page.name}
                        >
                            <Box
                                onClick={(e) => page.submenu ? handleMenuClick(e, page, index) : handleNavMenuItemClick(page.path)}
                                sx={{
                                    m: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    px: 2,
                                    py: 1,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontSize: 18,
                                    color: 'text.primary',
                                    '&:hover': {
                                        bgcolor: 'transparent',
                                        color: 'text.third'
                                    }
                                }}
                            >
                                {page.name}
                                {page.submenu && <ArrowDropDownIcon sx={{ ml: 0.5 }} />}
                            </Box>

                            {/* Submenu hiển thị khi hover */}
                            {page.submenu && (
                                <Menu
                                    anchorEl={anchorEl}
                                    open={openMenu === index}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                    slotProps={{
                                        paper: {
                                            sx: {
                                                width: '300px',   
                                                boxShadow: 'none',
                                                maxHeight: '550px',   
                                                overflowY: 'auto',
                                            },
                                        },
                                    }}
                                >
                                    {submenuItems.map((sub) => (
                                        <MenuItem
                                            key={sub.name}
                                            onClick={() => handleNavMenuItemClick(sub.path)}
                                            sx={{
                                                p: 4, fontSize: '18px', display: '-webkit-box',
                                                WebkitLineClamp: 1,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {sub.name}
                                        </MenuItem>
                                    ))}
                                </Menu>

                            )}
                        </Box>
                    ))}
                </Box>
                <IconButton sx={{ p: 3.5 }} onClick={handleCart}>
                    <Badge badgeContent={cartItemCount} color="error" showZero>
                        <ShoppingCartIcon />
                    </Badge>
                </IconButton>
                <IconButton
                    onClick={() => setMode(isDark ? 'light' : 'dark')}
                    sx={{ width: '80px', height: '80px', display: { xs: 'none', md: 'block' } }}
                >
                    {isDark ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
                <Box sx={{ mr: { xs: 1, md: 1 } }}>
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: { xs: 1, md: 3 }, borderRadius: 0 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500, mr: 1, maxWidth: { xs: '30px', md: '80px', overflow: 'hidden', whiteSpace: 'nowrap' } }}>
                            {userData?.user.username || ""}
                        </Typography>
                        <Avatar src={userData?.user.image ? `${userData.user.image}` : ""} />
                    </IconButton>
                    <Menu
                        sx={{ mt: '65px' }}
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        slotProps={{
                            paper: {
                                sx: {
                                    boxShadow: 'none',
                                },
                            },
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {settings.map((setting) => (
                            <MenuItem sx={{ p: 3, fontSize: '20px', }} key={setting.name} onClick={() => handleUserMenuItemClick(setting.path)}>
                                <Typography sx={{ textAlign: 'center' }}>{setting.name}</Typography>
                            </MenuItem>
                        ))}
                        <MenuItem sx={{ p: 2.5, display: { xs: 'flex', md: 'none' } }}>
                            <Box
                                onClick={() => setMode(isDark ? 'light' : 'dark')}
                                sx={{ fontSize: '16px', justifyContent: 'center', display: 'flex', gap: 1 }}
                            >
                                {isDark ? (
                                    <>
                                        <LightModeIcon />
                                        <span>Chế độ sáng</span>
                                    </>
                                ) : (
                                    <>
                                        <DarkModeIcon />
                                        <span>Chế độ tối</span>
                                    </>
                                )}

                            </Box>
                        </MenuItem>
                    </Menu>
                </Box>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none', position: 'absolute', left: 0 } }}>
                <IconButton
                    size='large'
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    sx={{ width: '100px', height: '100px' }}
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNavMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    slots={{ transition: Grow }}
                    slotProps={{
                        paper: {
                            sx: {
                                width: 1,
                                minWidth: 150,
                                boxShadow: 'none',
                            },
                        },
                    }}
                    open={Boolean(anchorElNavMenu)}
                    onClose={handleCloseNavMenu}
                    sx={{ display: { xs: 'block', md: 'none' } }}
                >
                    {pages.map((page) => (
                        <Box key={page.name}>
                            <MenuItem
                                onClick={async () => {
                                    if (page.submenu) {
                                        if (page.submenu === 'dynamic') {
                                            try {
                                                const data = await getCategories();
                                                setSubmenuItems(data.map(item => ({
                                                    name: item.name,
                                                    path: `${ROUTES.PRODUCTSBYCATEGORY}/${item.slug || item.id}`
                                                })));
                                                toggleSubMenu(page.name);
                                            } catch (err) {
                                                console.error('Lỗi khi gọi danh mục:', err);
                                                setSubmenuItems([]);
                                            }
                                        } else {
                                            toggleSubMenu(page.name);
                                        }
                                    } else {
                                        handleNavMenuItemClick(page.path);
                                    }
                                }}
                                sx={{ p: 3, justifyContent: 'space-between' }}
                            >
                                <Typography>{page.name}</Typography>
                                {page.submenu && (
                                    <ArrowDropDownIcon
                                        sx={{
                                            transform: openSubMenus[page.name] ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: '0.2s',
                                        }}
                                    />
                                )}
                            </MenuItem>

                            {/* Submenu render tại đây nếu mở */}
                            {page.submenu && openSubMenus[page.name] && (
                                <Box sx={{ pl: 1 }}>
                                    {(page.submenu === 'dynamic' ? submenuItems : page.submenu).map((sub) => (
                                        <MenuItem
                                            key={sub.name}
                                            onClick={() => {
                                                handleNavMenuItemClick(sub.path);
                                            }}
                                            sx={{
                                                p: 2, fontSize: '20px', display: '-webkit-box',
                                                WebkitLineClamp: 1,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            <Typography>{sub.name}</Typography>
                                        </MenuItem>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    ))}
                </Menu>
            </Box>
        </AppBar>
    );
}
export default NavBar;
