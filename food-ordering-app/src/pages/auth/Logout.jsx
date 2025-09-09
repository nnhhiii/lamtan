import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';
import Loading from '../../components/Loading';
import { Box} from "@mui/material";
import { userLogout } from '../../api/api';

const Logout = ({ showSnackbar }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logout = async () => {
      try {
        const res = await userLogout();
        showSnackbar(res.message, "success");
        navigate(ROUTES.LOGIN);
      } catch (err) {
        showSnackbar(err.response?.data?.message, "error");
      } finally {
        setLoading(false);
      }
    };

    logout();
  }, [navigate]);

  if (loading) {
    return (
    <Box sx={{ m: { xs: '120px 0', md: '150px 0' }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loading/>
      </Box>
  )}

  return null;
};

export default Logout;
