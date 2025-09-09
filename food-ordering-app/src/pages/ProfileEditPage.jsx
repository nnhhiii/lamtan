import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import {
    Box,
    TextField,
    Typography,
    Avatar,
    IconButton,
} from "@mui/material";
import Button from "@mui/material/Button";
import { updateUserInfo, getUsers } from "../api/api";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { sendOtp, verifyOtp } from "../api/api";
import AddressInput from "../components/AddressInput";


const ProfileEditPage = ({ showSnackbar, userData }) => {
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(userData?.user?.image || null);
    const [imageFile, setImageFile] = useState(null);
    const usersCache = useRef(null); // bên trong component
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [verified, setVerified] = useState(false);


    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
        defaultValues: {
            username: userData?.user?.username || "",
            email: userData?.user?.email || "",
            phone: userData?.user?.phone || "",
            address: userData?.user?.address || "",
            addressDetail: userData?.user?.addressDetail || "",
        },
    });


    const watchedFields = watch(); // tất cả giá trị hiện tại

    // Kiểm tra xem từng trường có thay đổi so với giá trị ban đầu
    const hasChanges =
        watchedFields.username !== userData?.user?.username ||
        watchedFields.email !== userData?.user?.email ||
        watchedFields.phone !== userData?.user?.phone ||
        watchedFields.address !== userData?.user?.address ||
        watchedFields.addressDetail !== userData?.user?.addressDetail ||
        imageFile !== null;

    // Kiểm tra riêng số điện thoại để hiển thị nút OTP
    const phoneChanged = watchedFields.phone !== userData?.user?.phone;
    const currentPhone = watchedFields.phone || "";


    const getAllUsers = async () => {
        if (!usersCache.current) {
            try {
                const users = await getUsers();
                usersCache.current = users;
            } catch (err) {
                console.error("Lỗi lấy users:", err);
                return [];
            }
        }
        return usersCache.current;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };


    const onSubmit = async (data) => {
        try {
            setLoading(true);
            let formData = new FormData();
            formData.append("username", data.username);
            formData.append("email", data.email);
            formData.append("phone", data.phone);
            formData.append("address", data.address);
            formData.append("addressDetail", data.addressDetail);
            if (imageFile) {
                formData.append("image", imageFile);
            }

            const res = await updateUserInfo(formData);
            showSnackbar(res.message, "success");
        } catch (err) {
            showSnackbar(err.response?.data?.message || "Có lỗi xảy ra", "error");
        } finally {
            setLoading(false);
        }
    };


    const handleSendOtp = async () => {
        const result = await sendOtp(watch("phone"));
        if (result.success) {
            setOtpSent(true);
            showSnackbar(result.message, "success");
        } else {
            showSnackbar(result.error, "error");
        }
    };

    const handleVerifyOtp = async () => {
        const result = await verifyOtp(watch("phone"), otp);
        if (result.success) {
            showSnackbar(result.message, "success");
            setVerified(true);
            setOtpSent(false); // ẩn ô nhập OTP
        } else {
            showSnackbar(result.error, "error");
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 500,
                my: 15,
                mx: "auto",
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                bgcolor: "background.paper",
            }}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Typography variant="h5" fontWeight={600} textAlign="center">
                Chỉnh sửa hồ sơ
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Avatar
                    src={imagePreview}
                    sx={{ width: 100, height: 100, border: "2px solid #ddd" }}
                />
                <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                    sx={{ ml: -4, mt: 6 }}
                >
                    <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                    <PhotoCamera />
                </IconButton>
            </Box>

            <TextField
                label="Tên hiển thị"
                fullWidth
                {...register("username", { required: "Vui lòng nhập tên" })}
                error={!!errors.username}
                helperText={errors.username?.message}
            />

            <TextField
                label="Email"
                fullWidth
                {...register("email", {
                    required: "Vui lòng nhập email",
                    validate: async (value) => {
                        if (value && value !== userData?.user?.email) {
                            const users = await getAllUsers();
                            const exists = users.some((u) => u.email === value);
                            return exists ? "Email đã được sử dụng" : true;
                        }
                        return true;
                    },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
            />

            <TextField
                label="Số điện thoại"
                fullWidth
                type="text"
                inputMode="numeric"
                {...register("phone", {
                    minLength: {
                        value: 10,
                        message: "Số điện thoại phải có ít nhất 10 số",
                    },
                    maxLength: {
                        value: 12,
                        message: "Số điện thoại không được quá 12 số",
                    },
                    validate: async (value) => {
                        if (value && value !== userData?.user?.phone) {
                            const users = await getAllUsers();
                            const exists = users.some((u) => u.phone === value);
                            return exists ? "Số điện thoại đã được sử dụng" : true;
                        }
                        return true;
                    },
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                slotProps={{
                    input: {
                        readOnly: verified,
                        endAdornment: verified ? (
                            <CheckCircleIcon color="success" />
                        ) : null,
                    },
                }}
            />

            {/* Nút gửi OTP */}
            {10 <= currentPhone?.length <= 13 && !errors.phone && !verified && phoneChanged && (
                <Button
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={handleSendOtp}
                >
                    Gửi mã xác minh
                </Button>
            )}


            {/* Nhập OTP */}
            {otpSent && !verified && (
                <>
                    <TextField
                        label="Nhập mã OTP"
                        fullWidth
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                    <Button
                        variant="contained"
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={handleVerifyOtp}
                    >
                        Xác minh
                    </Button>
                </>
            )}


            <AddressInput
                value={watch("address")}
                onChange={(val) => setValue("address", val)} // react-hook-form update
            />

            <TextField
                label="Địa chỉ cụ thể (Số nhà, hẻm, Tên tòa nhà,...)"
                fullWidth
                {...register("addressDetail", { required: "Vui lòng nhập địa chỉ cụ thể" })}
                error={!!errors.addressDetail}
                helperText={errors.addressDetail?.message}
            />

            <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                disabled={!hasChanges || loading || (phoneChanged && !verified)}
            >
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>

        </Box>
    );
};

export default ProfileEditPage;
