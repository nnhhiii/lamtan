import { useEffect, useState } from "react";
import { Box, Typography, InputAdornment, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import { getPostCategories, getPostCategory, getPosts, getPostsByCategoryId } from "../api/api";
import Loading from "../components/Loading";
import SideLeftBar from "../components/SideLeftBar";
import SearchIcon from "@mui/icons-material/Search";
import PostList1 from "../components/PostList1";

const PostsPage = ({ showSnackbar }) => {
    const { id } = useParams();
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [allPosts, setAllPosts] = useState([]); // tất cả posts


    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesData = await getPostCategories();
                let postsData;

                if (id) {
                    postsData = await getPostsByCategoryId(id);
                    const categoryData = await getPostCategory(id);
                    setCategory(categoryData);
                } else {
                    postsData = await getPosts();
                }

                // Luôn lưu tất cả posts để SideLeftBar tính itemCount
                const allPostsData = await getPosts(); // lấy tất cả posts
                setAllPosts(allPostsData);

                setPosts(postsData);
                setFilteredPosts(postsData);
                setCategories(categoriesData);
            } catch (err) {
                console.error(err);
                showSnackbar(err.response?.data?.message || "Có lỗi xảy ra", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, showSnackbar]);


    // 🔍 filter theo searchTerm
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredPosts(posts);
        } else {
            const lowerSearch = searchTerm.toLowerCase();
            const filtered = posts.filter(
                (p) =>
                    p.name.toLowerCase().includes(lowerSearch) ||
                    p.description?.toLowerCase().includes(lowerSearch)
            );
            setFilteredPosts(filtered);
        }
    }, [searchTerm, posts]);

    if (loading) {
        return (
            <Box sx={{ m: { xs: '120px 0', md: '150px 0' }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loading />
            </Box>
        );
    }

    return (
        <Box sx={{ my: 15, display: "flex", flexDirection: "column", alignItems: "center" }}>

            <Typography variant="h4" fontWeight={600} mb={4} textAlign="center">
                Tất cả bài viết {category ? `- ${category.name}` : ""}
            </Typography>
            <Box sx={{ display: 'flex', width: 0.8, flexDirection: { xs: 'column', md: 'row' }, justifyContent:'space-between' }}>
                {/* Sidebar + Search */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: { xs: 1, md: 0.25 } }}>
                    <TextField
                        placeholder="Tìm bài viết..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="small"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <SideLeftBar categories={categories} items={allPosts} type="post" />

                </Box>

                <Box sx={{ width:{xs:1, md:0.7} }}>
                    <PostList1 posts={filteredPosts} />
                </Box>
            </Box>
        </Box>
    );
};

export default PostsPage;
