import ClientList from "./ClientList";
import { Box, Typography } from '@mui/material';

const Client = () => {
    return (
        <Box sx={{ bgcolor: 'background.paper', p: { xs: 0, md: '40px 100px' }, mb: 5 }}>
            <Box sx={{ width: 1, justifyContent: 'center', p: { xs: 3, md: '0 50px' }, mb: { xs: 0, md: 5 } }}>
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
                    Khách hàng
                </Typography>
                <Typography gutterBottom sx={{ textAlign: { xs: 'justify', md: 'center' }, fontSize: { xs: '16px', md: '18px' } }}>
                    LAM TÂN sở hữu một mạng lưới phân phối rộng khắp, trải dài từ Bắc tới Nam. Chúng tôi hân hạnh phục vụ nhiều đối tượng khách hàng đa dạng như khách sạn nhà hàng, các công ty cung cấp thực phẩm, các cửa hàng thức ăn nhanh, căn-tin, bếp ăn tập thể, các nhà bán lẻ, đầu bếp… đặc biệt là các chuỗi siêu thị trên toàn quốc. Bạn có thể dễ dàng nhận ra một số thương hiệu lớn và quen thuộc hiện đang là khách hàng của chúng tôi.
                </Typography>
            </Box>
            <ClientList />
        </Box>
    )
}
export default Client;