import { Navigate, Route, Routes } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";
import CustomerSidebar from "./components/CustomerSidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import LoginChoice from "./pages/LoginChoice";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Rooms from "./pages/admin/Rooms";
import AddRoom from "./pages/admin/AddRoom";
import Customers from "./pages/admin/Customers";
import AddCustomer from "./pages/admin/AddCustomer";
import EditCustomer from "./pages/admin/EditCustomer";
import CustomerDetails from "./pages/admin/CustomerDetails";
import Electricity from "./pages/admin/Electricity";
import RoomBills from "./pages/admin/RoomBills";
import GenerateRoomBill from "./pages/admin/GenerateRoomBill";
import Payments from "./pages/admin/Payments";
import Reports from "./pages/admin/Reports";
import Admins from "./pages/admin/Admins";
import AdminProfile from "./pages/admin/AdminProfile";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import MyRoomBills from "./pages/customer/MyRoomBills";
import PaymentHistory from "./pages/customer/PaymentHistory";
import Profile from "./pages/customer/Profile";

const AdminLayout = () => (
  <div className="app-shell">
    <AdminSidebar />
    <main className="page-wrap">
      <Routes>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="rooms/add" element={<AddRoom />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/add" element={<AddCustomer />} />
        <Route path="customers/edit/:id" element={<EditCustomer />} />
        <Route path="customers/:id" element={<CustomerDetails />} />
        <Route path="electricity" element={<Electricity />} />
        <Route path="room-bills" element={<RoomBills />} />
        <Route path="room-bills/generate" element={<GenerateRoomBill />} />
        <Route path="payments" element={<Payments />} />
        <Route path="reports" element={<Reports />} />
        <Route path="admins" element={<Admins />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </main>
  </div>
);

const CustomerLayout = () => (
  <div className="app-shell">
    <CustomerSidebar />
    <main className="page-wrap">
      <Routes>
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="room-bills" element={<MyRoomBills />} />
        <Route path="payment-history" element={<PaymentHistory />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </main>
  </div>
);

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginChoice />} />
    <Route path="/admin/login" element={<Login role="admin" />} />
    <Route path="/customer/login" element={<Login role="customer" />} />
    <Route element={<ProtectedRoute role="admin" />}>
      <Route path="/admin/*" element={<AdminLayout />} />
    </Route>
    <Route element={<ProtectedRoute role="customer" />}>
      <Route path="/customer/*" element={<CustomerLayout />} />
    </Route>
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default App;
