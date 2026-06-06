import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { uploadUrl } from "../../api/axios";
import BillStatusBadge from "../../components/BillStatusBadge";
import { monthLabel } from "../../utils/months";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;
const signedMoney = (value) => {
  const number = Number(value || 0);
  if (number > 0) return `+ ${money(number)}`;
  if (number < 0) return `- ${money(Math.abs(number))}`;
  return money(0);
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
};

const CustomerDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/admin/customers/${id}`).then((res) => setData(res.data));
  }, [id]);

  if (!data) return null;
  const { customer, bills, previousMembers = [] } = data;

  return (
    <>
      <div className="page-title">
        <div><h2>{customer.name}</h2><p>Room {customer.roomNumber} boarder profile and bill history.</p></div>
        <Link className="btn secondary" to={`/admin/customers/edit/${customer._id}`}>Edit</Link>
      </div>
      <section className="panel mb-5">
        <h3 className="mb-3 text-lg font-black">Full Boarder Details</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <p><b>Name:</b> {customer.name}</p>
          <p><b>Room:</b> {customer.roomNumber}</p>
          <p><b>Status:</b> {customer.isActive ? "Active" : "Inactive"}</p>
          <p><b>Email:</b> {customer.email || customer.userId?.username || "-"}</p>
          <p><b>Phone:</b> {customer.phoneNumber}</p>
          <p><b>WhatsApp:</b> {customer.whatsappNumber || "-"}</p>
          <p><b>NIC:</b> {customer.nicNumber}</p>
          <p><b>Relationship:</b> {customer.relationship || "-"}</p>
          <p><b>Job:</b> {customer.job || "-"}</p>
          <p><b>Married Status:</b> {customer.marriedStatus || "-"}</p>
          <p><b>Registered Date:</b> {formatDate(customer.createdAt)}</p>
          <p><b>Room Fee:</b> {money(customer.roomFee)}</p>
          <p><b>Login Username:</b> {customer.email || customer.userId?.username || "-"}</p>
          <p><b>Initial Password:</b> Phone number</p>
          <p><b>Account:</b> {customer.userId?.isActive ? "Active" : "Inactive"}</p>
          <p className="md:col-span-3"><b>Address:</b> {customer.address || "-"}</p>
          <p><b>NIC Photo:</b> <a className="font-bold text-leaf" href={`${uploadUrl}/${customer.nicPhoto}`} target="_blank">Open</a></p>
          <p><b>Marriage Certificate:</b> {customer.marriageCertificate ? <a className="font-bold text-leaf" href={`${uploadUrl}/${customer.marriageCertificate}`} target="_blank">Open</a> : "-"}</p>
        </div>
      </section>
      <section className="panel">
        <h3 className="mb-3 text-lg font-black">Room Bill History</h3>
        <div className="table-wrap">
          <table className="data-table mobile-cards">
            <thead><tr><th>Month</th><th>Year</th><th>Monthly Rent</th><th>Electricity Fee</th><th>Previous Balance (+/-)</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th></tr></thead>
            <tbody>{bills.map((bill) => <tr key={bill._id}><td data-label="Month">{monthLabel(bill.month)}</td><td data-label="Year">{bill.year}</td><td data-label="Monthly Rent">{money(bill.roomFee)}</td><td data-label="Electricity Fee">{money(bill.electricityBill)}</td><td data-label="Previous Balance">{signedMoney(bill.previousMonthBalance)}</td><td data-label="Total">{money(bill.totalBill)}</td><td data-label="Paid">{money(bill.totalPaidAmount)}</td><td data-label="Balance">{signedMoney(bill.currentBalance)}</td><td data-label="Status"><BillStatusBadge status={bill.paymentStatus} /></td></tr>)}</tbody>
          </table>
        </div>
      </section>
      <section className="panel mt-5">
        <h3 className="mb-3 text-lg font-black">Previous Members In This Room</h3>
        <div className="table-wrap">
          <table className="data-table mobile-cards">
            <thead><tr><th>Name</th><th>Phone</th><th>NIC</th><th>Last Updated</th></tr></thead>
            <tbody>
              {previousMembers.map((member) => (
                <tr key={member._id}>
                  <td data-label="Name">{member.name}</td>
                  <td data-label="Phone">{member.phoneNumber}</td>
                  <td data-label="NIC">{member.nicNumber}</td>
                  <td data-label="Last Updated">{new Date(member.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {!previousMembers.length && <tr><td colSpan="4">No previous members found for this room.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default CustomerDetails;
