import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';
import Home from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import CartPage from './pages/CartPage';
import AdminPanel from './pages/Admin';
import AdminGuard from './constants/AdminAuth';
import Navbar from './components/Navbar';
import ProductDetail from './pages/ProductDetailPage';
import ProductsPage from './pages/ProductsPage';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from "./pages/auth/ResetPassword";
import Logout from './pages/auth/Logout';
import NotFoundPage from './pages/NotFoundPage';
import { useEffect, useState } from 'react';
import { getAbout, getCarts } from './api/api';
import Footer from './components/Footer';
import ROUTES from './routes';
import ScrollToTop from './ScrollToTop';
import { getUserInfo } from './api/api';
import PaymentSuccess from './pages/TransferSuccessPage';
import OrderSuccess from './pages/OrderSuccess';
import OrderDetail from './pages/OrderDetail';
import OrdersPage from './pages/OrdersPage';
import RatingPage from './pages/RatingPage';
import { Snackbar, Alert } from "@mui/material";
import ProfileEditPage from './pages/ProfileEditPage';
import PostsPage from './pages/PostsPage';
import PostDetail from './pages/PostDetail';
import AboutPage from './pages/AboutPage';
import SideRightBar from './components/SideRightBar';
import PositionsPage from './pages/PositionsPage';
import PositionDetailPage from './pages/PositionDetailPage';
import RecruitPage from './pages/RecruitPage';
import RecruitSuccess from './pages/RecruitSuccess';

function AppContent() {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [user, setUser] = useState(null);
  const [about, setAbout] = useState(null);
  const location = useLocation();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    // chỉ fetch user khi KHÔNG phải admin route
    if (!location.pathname.startsWith("/admin")) {
      const fetchData = async () => {
        try {
          const dataUser = await getUserInfo();
          const dataCart = await getCarts();
          setUser(dataUser);
          setCartItemCount(dataCart.items.length);


        } catch (error) {
          console.error("Lỗi khi lấy userInfo:", error);
          setUser(null);
        }
      };
      fetchData();
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!location.pathname.startsWith("/admin")) {
      const fetchData = async () => {
        try {
          const dataAbout = await getAbout();
          if (Array.isArray(dataAbout) && dataAbout.length > 0) {
            setAbout(dataAbout[0]);
          }
        } catch (err) {
          console.error("Lỗi khi fetch about:", err);
        }
      };
      fetchData();
    }
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith("/admin");
  return (
    <>
      {!isAdminRoute && <Navbar userData={user} aboutData={about} cartItemCount={cartItemCount} />}
      {!isAdminRoute && <SideRightBar />}

      <Routes>
        <Route path={ROUTES.HOME} element={<Home aboutData={about}/>} />
        <Route path={ROUTES.ABOUT} element={<AboutPage aboutData={about}/>} />
        <Route path={`${ROUTES.PRODUCTS}/:id`} element={<ProductDetail showSnackbar={showSnackbar} />} />
        <Route path={`${ROUTES.PRODUCTSBYCATEGORY}/:id`} element={<ProductsPage showSnackbar={showSnackbar} />} />
        <Route path={ROUTES.PRODUCTS} element={<ProductsPage showSnackbar={showSnackbar} />} />
        <Route path={ROUTES.CART} element={<CartPage showSnackbar={showSnackbar} />} />
        <Route path={ROUTES.POSTS} element={<PostsPage showSnackbar={showSnackbar} />} />
        <Route path={`${ROUTES.POSTS}/:id`} element={<PostDetail />} />
        <Route path={`${ROUTES.POSTSBYCATEGORY}/:id`} element={<PostsPage showSnackbar={showSnackbar} />} />
        <Route path={ROUTES.CHECKOUT} element={<CheckoutPage userData={user} showSnackbar={showSnackbar} />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage userData={user} />} />
        <Route path={ROUTES.EDITPROFILE} element={<ProfileEditPage showSnackbar={showSnackbar} userData={user} />} />
        <Route path={ROUTES.PAYMENT} element={<PaymentSuccess />} />
        <Route path={ROUTES.ORDERS} element={<OrdersPage showSnackbar={showSnackbar} />} />
        <Route path={`${ROUTES.ORDERSUCCESS}/:id`} element={<OrderSuccess showSnackbar={showSnackbar} />} />
        <Route path={`${ROUTES.ORDERDETAIL}/:id`} element={<OrderDetail showSnackbar={showSnackbar} />} />
        <Route path={`${ROUTES.RATING}/:orderId/:productId`} element={<RatingPage showSnackbar={showSnackbar} />} />
        <Route path={ROUTES.POSITIONS} element={<PositionsPage showSnackbar={showSnackbar} />} />
        <Route path={`${ROUTES.POSITIONS}/:id`} element={<PositionDetailPage showSnackbar={showSnackbar} />} />
        <Route path={ROUTES.RECRUIT} element={<RecruitPage showSnackbar={showSnackbar} />} />
        <Route path={ROUTES.RECRUITSUCCESS} element={<RecruitSuccess showSnackbar={showSnackbar} />} />
        <Route path='*' element={<NotFoundPage />} />

        {/* ✅ bọc admin route bằng AdminGuard */}
        <Route
          path="/admin/*"
          element={
            <AdminGuard>
              <AdminPanel />
            </AdminGuard>
          }
        />

        <Route path={ROUTES.LOGIN} element={<Login showSnackbar={showSnackbar} />} />
        <Route path={ROUTES.REGISTER} element={<Register showSnackbar={showSnackbar} />} />
        <Route path={ROUTES.FORGOTPASSWORD} element={<ForgotPassword showSnackbar={showSnackbar} />} />
        <Route path={ROUTES.RESETPASSWORD} element={<ResetPassword showSnackbar={showSnackbar} />} />
        <Route path={ROUTES.LOGOUT} element={<Logout showSnackbar={showSnackbar} />} />
      </Routes>

      {!isAdminRoute && <Footer aboutData={about}/>}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}


function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />

    </BrowserRouter>
  );
}

export default App;
