import { Gauge, LogOut, Receipt, UserRound, WalletCards } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const items = [
  { to: "/customer/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/customer/room-bills", label: "My Room Bills", icon: Receipt },
  { to: "/customer/payment-history", label: "Payment History", icon: WalletCards },
  { to: "/customer/profile", label: "Profile", icon: UserRound }
];

const CustomerSidebar = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/customer/login");
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">BH</div>
        <div>
          <h1>Boarding House</h1>
          <p>Boarder</p>
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

export default CustomerSidebar;
