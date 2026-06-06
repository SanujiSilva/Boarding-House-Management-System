import { Building2, ChartColumn, Gauge, Home, LogOut, Receipt, ShieldCheck, UserRound, UserRoundPlus, UsersRound, WalletCards } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const items = [
  { to: "/admin/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/admin/rooms", label: "Rooms", icon: Home },
  { to: "/admin/customers", label: "Boarders", icon: UsersRound },
  { to: "/admin/customers/add", label: "Register Boarder", icon: UserRoundPlus },
  { to: "/admin/electricity", label: "Electricity", icon: Building2 },
  { to: "/admin/room-bills", label: "Room Bills", icon: Receipt },
  { to: "/admin/payments", label: "Payments", icon: WalletCards },
  { to: "/admin/reports", label: "Reports", icon: ChartColumn },
  { to: "/admin/admins", label: "Admins", icon: ShieldCheck },
  { to: "/admin/profile", label: "Profile", icon: UserRound }
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">BH</div>
        <div>
          <h1>Boarding House</h1>
          <p>Admin</p>
        </div>
      </div>
      <nav className="nav-list">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <button className="logout-btn" onClick={logout}>
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
