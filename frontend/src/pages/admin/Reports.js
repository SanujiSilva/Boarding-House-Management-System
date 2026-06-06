import { useEffect, useState } from "react";
import { CircleDollarSign, Search, WalletCards, Zap } from "lucide-react";
import api from "../../api/axios";
import StatCard from "../../components/StatCard";
import BillStatusBadge from "../../components/BillStatusBadge";
import { monthLabel, monthOptions } from "../../utils/months";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;
const signedMoney = (value) => {
  const number = Number(value || 0);
  if (number > 0) return `+ ${money(number)}`;
  if (number < 0) return `- ${money(Math.abs(number))}`;
  return money(0);
};

const Reports = () => {
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });

  const load = () => {
    api.get("/admin/reports", { params: filters }).then((res) => setData(res.data));
  };

  useEffect(() => { load(); }, []);

  return (
    <>
      <div className="page-title">
        <div>
          <h2>Reports</h2>
          <p>Select month and year to view income and balance totals.</p>
        </div>
      </div>

      <section className="panel mb-5">
        <div className="form-grid">
          <label className="field">
            <span>Month</span>
            <select className="input" value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value })}>{monthOptions.map((month) => <option key={month.value} value={month.value}>{month.label}</option>)}</select>
          </label>
          <label className="field">
            <span>Year</span>
            <input className="input" type="number" value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })} />
          </label>
          <div className="field full">
            <button className="btn" type="button" onClick={load}><Search size={18} />Get Report</button>
          </div>
        </div>
      </section>

      {data && (
        <>
          <div className="mb-5">
            <h3 className="text-xl font-black">Report for {monthLabel(data.month)} / {data.year}</h3>
          </div>
          <div className="grid-cards mb-5">
            <StatCard title="Total Expected Income" value={money(data.totals?.expectedIncome)} icon={CircleDollarSign} />
            <StatCard title="Total Paid" value={money(data.totals?.paid)} icon={WalletCards} tone="gold" />
            <StatCard title="Total Unpaid Balance" value={money(data.totals?.unpaidBalance)} icon={CircleDollarSign} tone="coral" />
            <StatCard title="Total Electricity Income" value={money(data.totals?.electricityIncome)} icon={Zap} tone="gold" />
          </div>
          <section className="panel">
            <div className="table-wrap">
              <table className="data-table mobile-cards">
                <thead><tr><th>Room</th><th>Boarder</th><th>Monthly Rent</th><th>Electricity Fee</th><th>Previous Balance (+/-)</th><th>Total</th><th>Paid</th><th>Unpaid Balance</th><th>Status</th></tr></thead>
                <tbody>
                  {(data.bills || []).map((bill) => (
                    <tr key={bill._id}>
                      <td data-label="Room">{bill.roomNumber}</td>
                      <td data-label="Boarder">{bill.customerName}</td>
                      <td data-label="Monthly Rent">{money(bill.roomFee)}</td>
                      <td data-label="Electricity Fee">{money(bill.electricityBill)}</td>
                      <td data-label="Previous Balance">{signedMoney(bill.previousMonthBalance)}</td>
                      <td data-label="Total">{money(bill.totalBill)}</td>
                      <td data-label="Paid">{money(bill.totalPaidAmount)}</td>
                      <td data-label="Unpaid Balance">{money(Math.max(Number(bill.currentBalance || 0), 0))}</td>
                      <td data-label="Status"><BillStatusBadge status={bill.paymentStatus} /></td>
                    </tr>
                  ))}
                  {!data.bills?.length && <tr><td colSpan="9">No room bills found for this month and year.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Reports;
