import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from "@mui/material";
import { resetPassword } from '../../api/api';
import ROUTES from '../../routes';
import Loading from '../../components/Loading';

const ResetPassword = ({ showSnackbar }) => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get('token'));
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    if (!token) {
      alert("Token không hợp lệ!");
      return;
    }
    try {
      const res = await resetPassword(data.password, token);
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
            Đặt lại mật khẩu
          </Typography>

          <TextField
            {...register("password")}
            label="Mật khẩu mới"
            type="password"
            required
            fullWidth
          />

          <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: "primary.main", color: "primary.light", p: 2 }}>
            Xác nhận
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ResetPassword;
