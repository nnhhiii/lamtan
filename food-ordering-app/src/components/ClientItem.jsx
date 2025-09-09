import { Box } from '@mui/material';

const ClientItem = ({ client }) => {
    return (
        <Box
            sx={{
                width: {xs:'80px', md:'120px',xl:'140px'},
                height: {xs:'80px', md:'120px',xl:'140px'},
                backgroundImage: `url(${client.image ? client.image : 'https://res.cloudinary.com/dpuldllty/image/upload/v1736512130/default_tkzvsa.png'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                
            }}
        />
    );
};

export default ClientItem;
