import CallIcon from '@mui/icons-material/Call';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import { Box, IconButton } from '@mui/material';
const SideRightBar = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                right: 0,
                top: '50%',
                zIndex: 2,
                bgcolor: "#B12024",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.5,
                py: 2,
                px: 1
            }}>
            <IconButton
                component="a"
                href="https://www.facebook.com/thucphamlamtan"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "white", scale: 1.5 }}
            >
                <FacebookRoundedIcon />
            </IconButton>
            <Box sx={{ color: 'white', border: '1px solid white', width: 1 }} />
            <Box
                component="a"
                href="https://zalo.me/0937928146"
                target="_blank"
                rel="noopener noreferrer"
            >
                <Box
                    component="img"
                    sx={{
                        width: '40px',
                        cursor: 'pointer'
                    }}
                    alt="Zalo Logo"
                    src="/zalo1.png"
                />
            </Box>

            <Box sx={{ color: 'white', border: '1px solid white', width: 1 }} />
            <IconButton
                component="a"
                href="tel:0937928146"
                sx={{ color: "white", scale: 1.5 }}
            >
                <CallIcon />
            </IconButton>
        </Box>

    )
}

export default SideRightBar;