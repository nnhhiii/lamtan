import { Box } from '@mui/material';

const PartnerItem = ({ partner }) => {
    return (
        <Box
            sx={{
                width: {xs:'100px', md:'130px',xl:'150px'},
                height: {xs:'80px', md:'120px',xl:'130px'},
                backgroundImage: `url(${partner.image ? partner.image : 'https://res.cloudinary.com/dpuldllty/image/upload/v1736512130/default_tkzvsa.png'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        />
    );
};
export default PartnerItem;
