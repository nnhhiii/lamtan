import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, TextField, Button, Typography, Link } from "@mui/material";
import { userRegister } from '../../api/api';
import ROUTES from '../../routes';
import Loading from '../../components/Loading';

const Register = ({ showSnackbar }) => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await userRegister(data);
      showSnackbar(res.message, "success");
      navigate(ROUTES.LOGIN);
    } catch (err) {
      showSnackbar(err.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: "200px 10%", md: "200px 35%" } }}>
      {loading ? (
        <Loading />
      ) : (
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2, bgcolor: "background.paper", minWidth: '370px', p: 5, borderRadius: 3 }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Đăng ký
          </Typography>

          <TextField {...register("username")} label="Tên người dùng" required fullWidth />
          <TextField {...register("email")} label="Email" type="email" required fullWidth />
          <TextField {...register("password")} label="Mật khẩu" type="password" required fullWidth />

          <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: "primary.main", color: "primary.light", p: 2 }}>
            Đăng ký
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography>Đã có tài khoản?</Typography>
            <Link component={RouterLink} to={ROUTES.LOGIN} sx={{ color: 'primary.main', textDecoration: 'none', ml: 1 }}>
              Đăng nhập
            </Link>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Register;
