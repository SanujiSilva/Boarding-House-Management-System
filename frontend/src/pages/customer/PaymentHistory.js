import { useEffect, useState } from "react";
import api from "../../api/axios";
import { monthLabel } from "../../utils/months";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get("/customer/payment-history").then((res) => setPayments(res.data));
  }, []);

  return (
    <>
      <div className="page-title"><div><h2>Payment History</h2><p>Payments recorded for your assigned room.</p></div></div>
      <section className="panel">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Payment Date</th><th>Month</th><th>Year</th><th>Room</th><th>Received</th><th>Applied</th><th>Change</th><th>Method</th><th>Note</th></tr></thead>
            <tbody>{payments.map((payment) => <tr key={payment._id}><td>{new Date(payment.paymentDate).toLocaleDateString()}</td><td>{monthLabel(payment.month)}</td><td>{payment.year}</td><td>{payment.roomNumber}</td><td>{money(payment.receivedAmount || payment.paidAmount)}</td><td>{money(payment.paidAmount)}</td><td>{money(payment.changeAmount)}</td><td>{payment.paymentMethod}</td><td>{payment.note}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default PaymentHistory;
