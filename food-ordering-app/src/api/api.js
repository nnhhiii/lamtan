import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const getProducts = async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};
export const getProductDetail = async (id) => {
  const response = await axios.get(`${API_URL}/products/${id}`);
  return response.data;
};
export const getProductsByCategoryId = async (id) => {
  const response = await axios.get(`${API_URL}/products/category/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data;
};
export const getCategory = async (id) => {
  const response = await axios.get(`${API_URL}/categories/${id}`);
  return response.data;
};

export const getPartners = async () => {
  const response = await axios.get(`${API_URL}/partners`);
  return response.data;
};
export const getClients = async () => {
  const response = await axios.get(`${API_URL}/clients`);
  return response.data;
};
export const getAbout = async () => {
  const response = await axios.get(`${API_URL}/about`);
  return response.data;
};
export const getPositions = async () => {
  const response = await axios.get(`${API_URL}/positions`);
  return response.data;
};
export const getPosition = async (id) => {
  const response = await axios.get(`${API_URL}/positions/${id}`);
  return response.data;
};
export const createRecruit = async (formData) => {
  const res = await axios.post(`${API_URL}/recruits`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
  return res.data;
};


export const getPostCategories = async () => {
  const response = await axios.get(`${API_URL}/postCategories`);
  return response.data;
};
export const getPostCategory = async (id) => {
  const response = await axios.get(`${API_URL}/postCategories/${id}`);
  return response.data;
};


export const getPosts = async () => {
  const response = await axios.get(`${API_URL}/posts`);
  return response.data;
};
export const getPostsByCategoryId = async (id) => {
  const response = await axios.get(`${API_URL}/posts/category/${id}`);
  return response.data;
};
export const getPost = async (id) => {
  const response = await axios.get(`${API_URL}/posts/${id}`);
  return response.data;
};


export const getPromotions = async () => {
  const response = await axios.get(`${API_URL}/promotions`);
  return response.data;
};



// === USER CARTS ===
export const getCarts = async () => {
  const response = await axios.get(`${API_URL}/carts/getCartByUserId`, { withCredentials: true });
  return response.data;
};
export const addToCart = async ({ productId, variantId = null, quantity }) => {
  const res = await axios.post(`${API_URL}/carts/addCartByUserId`, { productId, variantId, quantity }, { withCredentials: true });
  return res.data;
};
export const updateCartItem = async (itemId, variantId, quantity) => {
  const res = await axios.put(`${API_URL}/carts/updateCartByUserId/${itemId}`, { quantity, variantId }, { withCredentials: true });
  return res.data;
};
export const deleteCartItem = async (itemId) => {
  const res = await axios.delete(`${API_URL}/carts/deleteCartItemByUserId/${itemId}`, { withCredentials: true });
  return res.data;
};


// === USER RATING ===
export const getRatingsByProductId = async (id) => {
  const response = await axios.get(`${API_URL}/ratings/product/${id}`);
  return response.data;
};
export const createRating = async (formData) => {
  const res = await axios.post(`${API_URL}/ratings`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
  return res.data;
};



// === USER PAYMENT ===
export const checkout = async (data) => {
  const res = await axios.post(`${API_URL}/orders/checkout`, data, { withCredentials: true });
  return res.data;
};
export const createPayment = async (data) => {
  const res = await axios.post(`${API_URL}/payment`, data, { withCredentials: true });
  return res.data;
};
export const getOrders = async () => {
  const response = await axios.get(`${API_URL}/orders/user`, { withCredentials: true });
  return response.data;
};
export const getOrderDetail = async (id) => {
  const response = await axios.get(`${API_URL}/orders/user/${id}`, { withCredentials: true });
  return response.data;
};
export const cancelOrder = async (id) => {
  const res = await axios.put(`${API_URL}/orders/cancelOrder/${id}`, {}, { withCredentials: true });
  return res.data;
};
// Lấy đơn hàng theo status (pending, confirmed, shipping, delivered, cancelled, all)
export const getOrdersByStatus = async (status = "all") => {
  const res = await axios.get(`${API_URL}/orders/user?status=${status}`, { withCredentials: true });
  return res.data;
};



// === USER AUTH ===
export const loginGoogle = () => {
  return `${API_URL}/auth/google`;
};
export const userLogin = async (data) => {
  const response = await axios.post(`${API_URL}/auth/login`, data, { withCredentials: true });
  return response.data;
};
export const userLogout = async () => {
  const response = await axios.post(`${API_URL}/auth/logout`, { withCredentials: true });
  return response.data;
};
export const userRegister = async (data) => {
  const res = await axios.post(`${API_URL}/auth/register`, data, { withCredentials: true });
  return res.data;
};
export const forgotPassword = async (email) => {
  const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
  return res.data;
};
export const resetPassword = async (newPassword, token) => {
  const res = await axios.post(`${API_URL}/auth/reset-password`, { newPassword, token });
  return res.data;
};
export const getUserInfo = async () => {
  const res = await axios.get(`${API_URL}/auth/profile`, { withCredentials: true });
  return res.data;
};
export const updateUserInfo = async (formData) => {
  const res = await axios.patch(`${API_URL}/users`, formData, {
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};
export const getUsers = async () => {
  const res = await axios.get(`${API_URL}/users`, { withCredentials: true });
  return res.data;
};
export const sendOtp = async (phone) => {
  const res = await axios.post(`${API_URL}/otp/send-otp`, { phone });
  return res.data;
};
export const verifyOtp = async (phone, otp) => {
  const res = await axios.post(`${API_URL}/otp/verify-otp`, { phone, otp });
  return res.data;
};


// ==== USER ADMIN AUTH ====
export const adminLogin = async ({ username, password }) => {
  const response = await axios.post(`${API_URL}/useradmins/login`, { username, password }, { withCredentials: true });
  return response.data;
};

export const checkAdminSession = async () => {
  const response = await axios.get(`${API_URL}/useradmins/check-session`, { withCredentials: true });
  return response.data;
};

export const getAdminProfile = async () => {
  const response = await axios.get(`${API_URL}/useradmins/profile`, { withCredentials: true });
  return response.data;
};

export const adminLogout = async () => {
  const response = await axios.post(`${API_URL}/useradmins/logout`, {}, { withCredentials: true });
  return response.data;
};