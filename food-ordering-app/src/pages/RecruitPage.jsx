import { useState } from "react";
import {
    Box,
    TextField,
    Typography,
    Button,
    Checkbox,
    FormControlLabel,
    Paper,
    FormGroup,
} from "@mui/material";
import { createRecruit } from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import ROUTES from "../routes";

const RecruitPage = ({ showSnackbar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { positionId, positionName } = location.state || {};

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        email: "",
        position: positionId,
        message: "",
        consent: false,
        cvUrl: null, // file
    });


    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "file") {
            setForm({ ...form, [name]: files[0] });
        } else {
            setForm({ ...form, [name]: type === "checkbox" ? checked : value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("fullName", form.fullName);
            formData.append("phone", form.phone);
            formData.append("email", form.email);
            formData.append("position", form.position);
            formData.append("message", form.message);
            if (form.cvUrl) {
                formData.append("cvUrl", form.cvUrl);
            }
            await createRecruit(formData);
            showSnackbar("Nộp hồ sơ thành công!", "success");
            navigate(ROUTES.RECRUITSUCCESS)
        } catch (err) {
            showSnackbar(err.response?.data?.message, "error");
            console.error(err);
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5, my: "100px" }}>
            <Paper sx={{ p: 4, width: { xs: "90%", md: "60%" } }}>
                <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
                    Ứng tuyển công việc
                </Typography>
                <Typography sx={{ mb: 2 }}> Công việc ứng tuyển:  <strong>{positionName}</strong> </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth label="Họ và tên" name="fullName" value={form.fullName} onChange={handleChange} required sx={{ mb: 2 }} />
                    <TextField fullWidth label="Số điện thoại" name="phone" value={form.phone} onChange={handleChange} required sx={{ mb: 2 }} />
                    <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} required sx={{ mb: 2 }} />

                    <Typography>Đính kèm CV (pdf, docx, doc tối đa 3MB)</Typography>
                    <TextField
                        fullWidth
                        type="file"
                        name="cvUrl"
                        required
                        slotProps={{ input: { accept: ".pdf,.doc,.docx" } }}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />

                    <TextField fullWidth label="Thư giới thiệu" name="message" value={form.message} onChange={handleChange} multiline rows={4} required sx={{ mb: 2 }} />

                    <FormGroup sx={{ width: "100%" }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={form.consent}
                                    onChange={handleChange}
                                    name="consent"
                                />
                            }
                            label="Tôi đồng ý cho phép lưu trữ và xử lý dữ liệu cá nhân"
                        />
                    </FormGroup>


                    <Button type="submit" variant="contained" sx={{ mt: 2, float:'right' }} disabled={!form.consent}>
                        Gửi hồ sơ
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default RecruitPage;
