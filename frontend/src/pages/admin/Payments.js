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
          <table className="data-table">
            <thead><tr><th>Date</th><th>Room</th><th>Boarder</th><th>Month</th><th>Received</th><th>Applied</th><th>Change</th><th>Action</th><th>Method</th><th>Note</th></tr></thead>
            <tbody>{payments.map((p) => <tr key={p._id}><td>{new Date(p.paymentDate).toLocaleDateString()}</td><td>{p.roomNumber}</td><td>{p.customerName}</td><td>{monthLabel(p.month)} / {p.year}</td><td>{money(p.receivedAmount || p.paidAmount)}</td><td>{money(p.paidAmount)}</td><td>{money(p.changeAmount)}</td><td>{p.overPaymentAction || "None"}</td><td>{p.paymentMethod}</td><td>{p.note}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Payments;
