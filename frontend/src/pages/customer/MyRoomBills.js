import { useEffect, useState } from "react";
import { FileText, Search } from "lucide-react";
import api from "../../api/axios";
import BillStatusBadge from "../../components/BillStatusBadge";
import { monthLabel, monthOptions } from "../../utils/months";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;
const signedMoney = (value) => {
  const number = Number(value || 0);
  if (number > 0) return `+ ${money(number)}`;
  if (number < 0) return `- ${money(Math.abs(number))}`;
  return money(0);
};

const MyRoomBills = () => {
  const [bills, setBills] = useState([]);
  const [filters, setFilters] = useState({ month: "", year: "" });

  const load = () => api.get("/customer/room-bills", { params: filters }).then((res) => setBills(res.data));
  useEffect(() => { load(); }, []);

  return (
    <>
      <div className="page-title">
        <div>
          <h2 style={{ background: "linear-gradient(135deg, #6ba88f 0%, #507568 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>My Room Bills</h2>
          <p>View your billing history and payment status.</p>
        </div>
      </div>

      <section className="panel">
        {/* Filter Bar */}
        <div className="filter-bar mb-5">
          <select 
            className="input max-w-[190px]" 
            value={filters.month} 
            onChange={(e) => setFilters({ ...filters, month: e.target.value })}
          >
            <option value="">All Months</option>
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
          <input 
            className="input max-w-[150px]" 
            placeholder="Year" 
            type="number" 
            value={filters.year} 
            onChange={(e) => setFilters({ ...filters, year: e.target.value })} 
          />
          <button className="btn secondary" onClick={load}>
            <Search size={18} />Filter
          </button>
        </div>

        {/* Bills Table */}
        {bills.length > 0 ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Year</th>
                  <th>Room</th>
                  <th>Rent</th>
                  <th>Units</th>
                  <th>Electricity</th>
                  <th>Previous</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill._id}>
                    <td className="font-semibold">{monthLabel(bill.month)}</td>
                    <td>{bill.year}</td>
                    <td>{bill.roomNumber}</td>
                    <td>{money(bill.roomFee)}</td>
                    <td className="text-center">{bill.electricityUsedUnits}</td>
                    <td>{money(bill.electricityBill)}</td>
                    <td style={{ color: "#c9a961" }}>{signedMoney(bill.previousMonthBalance)}</td>
                    <td className="font-semibold">{money(bill.totalBill)}</td>
                    <td style={{ color: "#6ba88f", fontWeight: "600" }}>{money(bill.totalPaidAmount)}</td>
                    <td style={{ fontWeight: "600", color: bill.currentBalance > 0 ? "#d97d6e" : "#6ba88f" }}>
                      {signedMoney(bill.currentBalance)}
                    </td>
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
            <FileText size={68} />
            <strong>No Bills Found</strong>
            <p>No bills match your search filters. Check back soon or try adjusting your search.</p>
          </div>
        )}
      </section>
    </>
  );
};

export default MyRoomBills;
