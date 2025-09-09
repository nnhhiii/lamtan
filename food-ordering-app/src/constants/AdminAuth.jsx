import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { checkAdminSession } from "../api/api";

export default function AdminGuard({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await checkAdminSession();
        // Nếu đã login admin mà vẫn vào /admin/login → redirect sang /admin
        if (location.pathname === "/admin/login") {
          navigate("/admin");
        }
      } catch {
        // Nếu chưa login admin → bắt buộc về /admin/login
        if (location.pathname.startsWith("/admin") && location.pathname !== "/admin/login") {
          navigate("/admin/login");
        }
      }
    };

    checkAuth();
  }, [location, navigate]);

  return children;
}
