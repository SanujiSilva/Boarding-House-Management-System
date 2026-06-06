import { useEffect, useState } from "react";
import { BarChart3, DoorOpen, Home, TrendingUp, UsersRound } from "lucide-react";
import api from "../../api/axios";
import StatCard from "../../components/StatCard";
import BillStatusBadge from "../../components/BillStatusBadge";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then((res) => setData(res.data));
  }, []);

  return (
    <>
      <div className="page-title">
        <div>
          <h2 style={{ background: "linear-gradient(135deg, #6ba88f 0%, #507568 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Dashboard</h2>
          <p>Real-time overview of rooms, boarders, and billing status.</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid-cards mb-5">
        <StatCard title="Total Rooms" value={data?.totalRooms} icon={Home} />
        <StatCard title="Available Rooms" value={data?.availableRooms} icon={DoorOpen} tone="gold" />
        <StatCard title="Active Boarders" value={data?.totalBoarders} icon={UsersRound} tone="leaf" />
        <StatCard title="Unpaid Bills" value={data?.roomsWithUnpaidBills?.length || 0} icon={BarChart3} tone="coral" />
      </div>

      {/* Unpaid Bills Section */}
      <section className="panel">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div style={{ width: "4px", height: "24px", borderRadius: "2px", background: "linear-gradient(135deg, #2ecc71 0%, #1e8449 100%)" }}></div>
          <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "900", color: "#0f1410" }}>Rooms With Outstanding Balances</h3>
        </div>
        {(data?.roomsWithUnpaidBills || []).length > 0 ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Boarder</th>
                  <th>Total Bill</th>
                  <th>Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(data?.roomsWithUnpaidBills || []).map((bill) => (
                  <tr key={bill._id}>
                    <td className="font-semibold" style={{ color: "#6ba88f" }}>{bill.roomNumber}</td>
                    <td>{bill.customerName}</td>
                    <td>{money(bill.totalBill)}</td>
                    <td className="font-semibold" style={{ color: "#d97d6e" }}>{money(bill.currentBalance)}</td>
                    <td>
                      <BillStatusBadge status={bill.paymentStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <BarChart3 size={68} />
            <strong>All Bills Paid</strong>
            <p>Excellent! There are no outstanding balances for the current month. Keep up the great work!</p>
          </div>
        )}
      </section>
    </>
  );
};

export default AdminDashboard;
