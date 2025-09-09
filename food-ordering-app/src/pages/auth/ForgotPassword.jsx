import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, TextField, Button, Typography } from "@mui/material";
import { forgotPassword } from '../../api/api';
import Loading from '../../components/Loading';

const ForgotPassword = ({ showSnackbar }) => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await forgotPassword(data.email);
      showSnackbar(res.message, "success");
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
            Quên mật khẩu
          </Typography>

          <TextField {...register("email")} label="Nhập email" type="email" required fullWidth />

          <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: "primary.main", color: "primary.light", p: 2 }}>
            Gửi liên kết đặt lại
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ForgotPassword;
