import { useEffect, useState } from "react";
import api from "../../api/axios";
import { monthLabel } from "../../utils/months";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

const Payments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get("/admin/payments").then((res) => setPayments(res.data));
  }, []);

  return (
    <>
      <div className="page-title"><div><h2>Payments</h2><p>All payments recorded against room bills.</p></div></div>
      <section className="panel">
        <div className="table-wrap">
          <table className="data-table mobile-cards">
            <thead><tr><th>Date</th><th>Room</th><th>Boarder</th><th>Month</th><th>Received</th><th>Applied</th><th>Change</th><th>Action</th><th>Method</th><th>Note</th></tr></thead>
            <tbody>{payments.map((p) => <tr key={p._id}><td data-label="Date">{new Date(p.paymentDate).toLocaleDateString()}</td><td data-label="Room">{p.roomNumber}</td><td data-label="Boarder">{p.customerName}</td><td data-label="Month">{monthLabel(p.month)} / {p.year}</td><td data-label="Received">{money(p.receivedAmount || p.paidAmount)}</td><td data-label="Applied">{money(p.paidAmount)}</td><td data-label="Change">{money(p.changeAmount)}</td><td data-label="Action">{p.overPaymentAction || "None"}</td><td data-label="Method">{p.paymentMethod}</td><td data-label="Note">{p.note}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Payments;
