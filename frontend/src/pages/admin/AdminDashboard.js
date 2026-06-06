import { useEffect, useState } from "react";
import { DoorOpen, Home, UsersRound } from "lucide-react";
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
          <h2>Admin Dashboard</h2>
          <p>Current month room billing and occupancy snapshot.</p>
        </div>
      </div>
      <div className="grid-cards">
        <StatCard title="Total Rooms" value={data?.totalRooms} icon={Home} />
        <StatCard title="Available Rooms" value={data?.availableRooms} icon={DoorOpen} tone="gold" />
        <StatCard title="Boarders" value={data?.totalBoarders} icon={UsersRound} tone="gold" />
      </div>

      <div className="mt-5 grid gap-5">
        <section className="panel">
          <h3 className="mb-3 text-lg font-black">Rooms With Unpaid Bills</h3>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Room</th><th>Boarder</th><th>Total Bill</th><th>Balance</th><th>Status</th></tr></thead>
              <tbody>
                {(data?.roomsWithUnpaidBills || []).map((bill) => (
                  <tr key={bill._id}><td>{bill.roomNumber}</td><td>{bill.customerName}</td><td>{money(bill.totalBill)}</td><td>{money(bill.currentBalance)}</td><td><BillStatusBadge status={bill.paymentStatus} /></td></tr>
                ))}
                {!(data?.roomsWithUnpaidBills || []).length && <tr><td colSpan="5">No unpaid bills for the current month.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
};

export default AdminDashboard;
