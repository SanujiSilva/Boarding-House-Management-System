import { useEffect, useState } from "react";
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
      <div className="page-title"><div><h2>My Room Bills</h2><p>Monthly bill history for your assigned room.</p></div></div>
      <section className="panel">
        <div className="mb-4 flex flex-wrap gap-2">
          <select className="input max-w-[190px]" value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value })}>
            <option value="">All Months</option>
            {monthOptions.map((month) => <option key={month.value} value={month.value}>{month.label}</option>)}
          </select>
          <input className="input max-w-[150px]" placeholder="Year" type="number" value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })} />
          <button className="btn secondary" onClick={load}>Filter</button>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Month</th><th>Year</th><th>Room</th><th>Monthly Rent</th><th>Units</th><th>Electricity Fee</th><th>Previous Balance (+/-)</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th></tr></thead>
            <tbody>{bills.map((bill) => <tr key={bill._id}><td>{monthLabel(bill.month)}</td><td>{bill.year}</td><td>{bill.roomNumber}</td><td>{money(bill.roomFee)}</td><td>{bill.electricityUsedUnits}</td><td>{money(bill.electricityBill)}</td><td>{signedMoney(bill.previousMonthBalance)}</td><td>{money(bill.totalBill)}</td><td>{money(bill.totalPaidAmount)}</td><td>{signedMoney(bill.currentBalance)}</td><td><BillStatusBadge status={bill.paymentStatus} /></td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default MyRoomBills;
