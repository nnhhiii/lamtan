import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    Container,
    Card,
    CardMedia,
    CardContent,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { getPost } from "../api/api";
import Loading from "../components/Loading";
import ROUTES from "../routes";

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await getPost(id);
                setPost(res);
            } catch (err) {
                console.error("Failed to fetch post:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", my: 15 }}>
                <Loading />
            </Box>
        );
    }

    if (!post) {
        return (
            <Box sx={{ textAlign: "center", my: 15 }}>
                <Typography variant="h6">Không tìm thấy bài viết</Typography>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    component={RouterLink}
                    to="/posts"
                    sx={{ mt: 2 }}
                >
                    Quay lại
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: 'background.paper', py: 15, mb: 10 }}>
  <Container maxWidth="lg">
    <Button
      variant="outlined"
      startIcon={<ArrowBack />}
      component={RouterLink}
      to={ROUTES.POSTS}
      sx={{ mb: 3 }}
    >
      Danh sách
    </Button>

    {/* Dùng Box thay Card */}
    <Box sx={{ boxShadow: 0, bgcolor: 'transparent' }}>
      {/* Thay CardMedia */}
      <Box
        component="img"
        src={post.image}
        alt={post.name}
        sx={{
          width: 1,
          maxHeight: 500,
          objectFit: "cover",
          borderRadius: 1
        }}
      />

      {/* Thay CardContent */}
      <Box sx={{ px: 0, mt: 2 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {post.name}
        </Typography>
        <Typography
          variant="body1"
          sx={{ whiteSpace: "pre-line" }}
          dangerouslySetInnerHTML={{ __html: post.description }}
        />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 2 }}
        >
          Ngày đăng: {new Date(post.createdAt).toLocaleDateString("vi-VN")}
        </Typography>
      </Box>
    </Box>
  </Container>
</Box>

    );
};

export default PostDetail;
