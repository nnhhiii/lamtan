import ProductList from '../components/ProductList';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import { getCategories, getProducts, getCategory, getProductsByCategoryId } from '../api/api';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SideLeftBar from '../components/SideLeftBar';
import Loading from '../components/Loading';
import SearchIcon from "@mui/icons-material/Search";

const ProductsPage = ({ showSnackbar }) => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [allProducts, setAllProducts] = useState([]); // tất cả posts


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const categoriesData = await getCategories();

                let productsData;
                if (id) {
                    productsData = await getProductsByCategoryId(id);
                    const categoryData = await getCategory(id);
                    setCategory(categoryData);
                } else {
                    productsData = await getProducts();
                    setCategory({ name: 'Tất cả sản phẩm', banner: '/bg1.jpg' });
                }
                const allProductsData = await getProducts(); // lấy tất cả 
                setAllProducts(allProductsData);

                setCategories(categoriesData);
                setProducts(productsData);
                setFilteredProducts(productsData);
            } catch (err) {
                showSnackbar(err.response?.data?.message || "Có lỗi xảy ra", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredProducts(products);
        } else {
            const lowerSearch = searchTerm.toLowerCase();
            const filtered = products.filter(
                (p) =>
                    p.name.toLowerCase().includes(lowerSearch) ||
                    p.description?.toLowerCase().includes(lowerSearch)
            );
            setFilteredProducts(filtered);
        }
    }, [searchTerm, products]);

    if (loading) {
        return (
            <Box sx={{ m: { xs: '120px 0', md: '150px 0' }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loading />
            </Box>
        );
    }

    return (
        <>
            <Box
                sx={{
                    backgroundImage: `url(${category?.banner})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: 1,
                    height: { xs: '350px', md: '400px', lg: '650px' },
                    marginTop: '100px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        bgcolor: 'rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        color="white"
                        sx={{ fontSize: { xs: '30px', md: '60px' }, fontWeight: 700 }}
                    >
                        {category?.name}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ my: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Box sx={{ display: 'flex', width: 0.8, flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between' }}>
                    {/* Sidebar + Search */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: { xs: 1, md: 0.25 } }}>
                        <TextField
                            placeholder="Tìm sản phẩm..."
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

                        <SideLeftBar categories={categories} items={allProducts} type="product" />
                    </Box>

                    {/* Danh sách bài viết */}
                    <Box sx={{ width: { xs: 1, md: 0.7 } }}>
                        <ProductList products={filteredProducts} />
                    </Box>
                </Box>
            </Box>
        </>
    );
};
export default ProductsPage;
