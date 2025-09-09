import { Box, Typography } from '@mui/material';
const Milestone = () => {
    return(
        <Box
        sx={{
          backgroundImage: `url('bg1.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: 1,
          height: { xs: '200px', md: '300px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{
          width: { xs: 0.95, md: 0.8 },
          height: 0.9,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: { xs: 1, md: 3 },
          alignItems: 'center',
        }}>
          <Typography gutterBottom
            sx={{
              textAlign: { xs: 'center', md: 'left' },
              fontSize: { xs: '23px', md: '40px' },
              letterSpacing: { xs: 0, md: 1 },
              fontWeight: 700,
              color: '#B12024',
            }}>
            Những cột mốc quan trọng
          </Typography>
          <Box sx={{ display: 'flex', width: 1, justifyContent: { xs: 'space-between', md: 'space-evenly' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{
                color: '#B12024',
                borderBottom: '2px solid #B12024',
                fontWeight: 700,
                fontSize: { xs: '23px', md: '40px' },
                px: 2,
                width: 'fit-content',
                textAlign: 'center'
              }}>
                21+
              </Box>
              <Typography sx={{ textAlign: 'center', mt: 1, color:'#303030' }}>Năm kinh nghiệm</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{
                color: '#B12024',
                borderBottom: '2px solid #B12024',
                fontWeight: 700,
                fontSize: { xs: '23px', md: '40px' },
                px: 2,
                width: 'fit-content',
                textAlign: 'center'
              }}>
                50+
              </Box>
              <Typography sx={{ textAlign: 'center', mt: 1, color:'#303030' }}>Nhân viên</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{
                color: '#B12024',
                borderBottom: '2px solid #B12024',
                fontWeight: 700,
                fontSize: { xs: '23px', md: '40px' },
                px: 2,
                width: 'fit-content',
                textAlign: 'center'
              }}>
                10+
              </Box>
              <Typography sx={{ textAlign: 'center', mt: 1, color:'#303030' }}>Đối tác</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{
                color: '#B12024',
                borderBottom: '2px solid #B12024',
                fontWeight: 700,
                fontSize: { xs: '23px', md: '40px' },
                px: 2,
                width: 'fit-content',
                textAlign: 'center'
              }}>
                960+
              </Box>
              <Typography sx={{ textAlign: 'center', mt: 1, color:'#303030' }}>Khách hàng</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    )
}

export default Milestone;