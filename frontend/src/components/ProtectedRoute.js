import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) return <Navigate to={role ? `/${role}/login` : "/login"} replace />;
  if (role && user.role !== role) return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/customer/dashboard"} replace />;
  return <Outlet />;
};

export default ProtectedRoute;
