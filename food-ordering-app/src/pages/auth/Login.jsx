import { useState } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Link } from "@mui/material";
import { userLogin, loginGoogle } from '../../api/api'
import ROUTES from '../../routes';
import { Link as RouterLink } from 'react-router-dom';
import Loading from "../../components/Loading";

const Login = ({ showSnackbar }) => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await userLogin(data);
      showSnackbar(res.message, "success");
      navigate(ROUTES.HOME);
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
            Đăng nhập
          </Typography>

          <TextField
            {...register("email")}
            label="Email"
            type="email"
            required
            fullWidth
          />

          <TextField
            {...register("password")}
            label="Password"
            type="password"
            required
            fullWidth
          />

          <Link component={RouterLink} to={ROUTES.FORGOTPASSWORD} sx={{ textDecoration: 'none', alignSelf: 'flex-end', color: 'text.primary' }}>
            Quên mật khẩu
          </Link>

          <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: "primary.main", color: "primary.light", p: 2 }}>
            Đăng nhập
          </Button>


          <Box
            component="a"
            href={loginGoogle()}
            sx={{ display: 'flex', justifyContent: 'center', p: 1.5, cursor: 'pointer', textDecoration: 'none', color: 'text.primary' }}
          >
            <Box component="img" src="https://img.icons8.com/?size=30&id=17949&format=png&color=000000" sx={{ mr: 1 }}></Box>
            Đăng nhập với Google
          </Box>
          <Box
            sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography>Chưa có tài khoản? </Typography>
            <Link component={RouterLink} to={ROUTES.REGISTER} sx={{ textDecoration: 'none', ml: 1 }}>
              Đăng ký
            </Link>

          </Box>
        </Box>
      )}
    </Box>

  );
};

export default Login;
