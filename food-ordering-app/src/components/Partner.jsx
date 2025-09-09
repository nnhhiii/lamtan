import PartnerList from "./PartnerList";
import { Box, Typography } from '@mui/material';

const Partner = () => {
    return (
        <Box sx={{ bgcolor: 'background.paper', p: { xs: 0, md: '40px 100px' }, my:5 }}>
            <Box sx={{ width: 1, justifyContent: 'center', p: { xs: 3, md: '0 50px' } }}>
                <Typography
                    sx={{
                        textAlign: 'center',
                        fontSize: { xs: '12px', md: '16px' },
                        fontWeight: 700,
                        color: 'primary.main'
                    }}>
                    Thương hiệu
                </Typography>
                <Typography gutterBottom
                    sx={{
                        textAlign: 'center',
                        fontSize: { xs: '25px', md: '40px' },
                        letterSpacing: { xs: 0, md: 1 },
                        fontWeight: 700,
                    }}>
                    Đối tác
                </Typography>
                <Typography gutterBottom sx={{ textAlign: { xs: 'justify', md: 'center' }, fontSize: { xs: '16px', md: '18px' } }}>
                    Chúng tôi đang phân phối hơn 10+ nhãn hàng nổi tiếng trên khắp thế giới như: Lamb Weston, Mc Cain, Euro Gold, Hungritos, Vilvi, Polmlek, Frosty Boy, Farm Frites, …
                </Typography>
            </Box>
            <PartnerList />
        </Box>
    )
}
export default Partner;