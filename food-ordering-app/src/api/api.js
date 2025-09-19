import api from "./axiosInstance";

// === PRODUCTS ===
export const getProducts = async () => (await api.get("/products")).data;
export const getProductDetail = async (id) => (await api.get(`/products/${id}`)).data;
export const getProductsByCategoryId = async (id) => (await api.get(`/products/category/${id}`)).data;

// === CATEGORIES ===
export const getCategories = async () => (await api.get("/categories")).data;
export const getCategory = async (id) => (await api.get(`/categories/${id}`)).data;

// === PARTNERS / CLIENTS / ABOUT ===
export const getPartners = async () => (await api.get("/partners")).data;
export const getClients = async () => (await api.get("/clients")).data;
export const getAbout = async () => (await api.get("/about")).data;

// === POSITIONS ===
export const getPositions = async () => (await api.get("/positions")).data;
export const getPosition = async (id) => (await api.get(`/positions/${id}`)).data;
export const createRecruit = async (formData) => (await api.post("/recruits", formData, {
  headers: { "Content-Type": "multipart/form-data" }
})).data;

// === POST CATEGORIES ===
export const getPostCategories = async () => (await api.get("/postCategories")).data;
export const getPostCategory = async (id) => (await api.get(`/postCategories/${id}`)).data;

// === POSTS ===
export const getPosts = async () => (await api.get("/posts")).data;
export const getPostsByCategoryId = async (id) => (await api.get(`/posts/category/${id}`)).data;
export const getPost = async (id) => (await api.get(`/posts/${id}`)).data;

// === PROMOTIONS ===
export const getPromotions = async () => (await api.get("/promotions")).data;

// === USER CARTS ===
export const getCarts = async () => (await api.get("/carts/getCartByUserId")).data;
export const addToCart = async ({ productId, variantId = null, quantity }) =>
  (await api.post("/carts/addCartByUserId", { productId, variantId, quantity })).data;
export const updateCartItem = async (itemId, variantId, quantity) =>
  (await api.put(`/carts/updateCartByUserId/${itemId}`, { quantity, variantId })).data;
export const deleteCartItem = async (itemId) =>
  (await api.delete(`/carts/deleteCartItemByUserId/${itemId}`)).data;

// === USER RATING ===
export const getRatingsByProductId = async (id) => (await api.get(`/ratings/product/${id}`)).data;
export const createRating = async (formData) =>
  (await api.post("/ratings", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  })).data;

// === USER PAYMENT ===
export const checkout = async (data) => (await api.post("/orders/checkout", data)).data;
export const createPayment = async (data) => (await api.post("/payment", data)).data;
export const getOrders = async () => (await api.get("/orders/user")).data;
export const getOrderDetail = async (id) => (await api.get(`/orders/user/${id}`)).data;
export const cancelOrder = async (id) => (await api.put(`/orders/cancelOrder/${id}`)).data;
export const getOrdersByStatus = async (status = "all") =>
  (await api.get(`/orders/user?status=${status}`)).data;

// === USER AUTH ===
export const loginGoogle = () => `${api.defaults.baseURL}/auth/google`;

export const userLogin = async (data) => {
  const res = await api.post("/auth/login", data);

  if (res.data?.token) {
    if (res.data.role !== "user") {
      if (res.data.role !== "user") {
        throw new Error("Đây là tài khoản quản trị viên, vui lòng đăng nhập ở trang admin!");
      }
    }

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
  }

  return res.data;
};

export const userLogout = async () => {
  localStorage.removeItem("token"); // React Native thì AsyncStorage.removeItem
  localStorage.removeItem("role");
  return { message: 'Đăng xuất thành công!' };
};

export const userRegister = async (data) => {
  const res = await api.post("/auth/register", data);
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
  }
  return res.data;
};

export const forgotPassword = async (email) => (await api.post("/auth/forgot-password", { email })).data;
export const resetPassword = async (newPassword, token) =>
  (await api.post("/auth/reset-password", { newPassword, token })).data;
export const getUserInfo = async () => (await api.get("/auth/profile")).data;
export const updateUserInfo = async (formData) =>
  (await api.patch("/users", formData, { headers: { "Content-Type": "multipart/form-data" } })).data;

export const getUsers = async () => (await api.get("/users")).data;
export const sendOtp = async (phone) => (await api.post("/otp/send-otp", { phone })).data;
export const verifyOtp = async (phone, otp) => (await api.post("/otp/verify-otp", { phone, otp })).data;

