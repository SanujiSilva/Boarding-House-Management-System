import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Banknote, Printer, Rows3 } from "lucide-react";
import api from "../../api/axios";
import BillStatusBadge from "../../components/BillStatusBadge";
import { monthLabel } from "../../utils/months";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;
const signedMoney = (value) => {
  const number = Number(value || 0);
  if (number > 0) return `+ ${money(number)}`;
  if (number < 0) return `- ${money(Math.abs(number))}`;
  return money(0);
};

const RoomBills = () => {
  const [rooms, setRooms] = useState([]);
  const [bills, setBills] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [selectedBillId, setSelectedBillId] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [payment, setPayment] = useState({
    receivedAmount: "",
    overPaymentAction: "Give Change",
    paymentMethod: "Cash",
    paymentDate: new Date().toISOString().slice(0, 10),
    note: ""
  });

  const selectedRoom = useMemo(() => rooms.find((room) => room._id === selectedRoomId), [rooms, selectedRoomId]);
  const selectedBill = useMemo(() => bills.find((bill) => bill._id === selectedBillId) || bills[0], [bills, selectedBillId]);
  const receivedAmount = Number(payment.receivedAmount || 0);
  const fullBalance = Number(selectedBill?.currentBalance || 0);
  const overpaymentAmount = Math.max(receivedAmount - fullBalance, 0);
  const changeAmount = payment.overPaymentAction === "Give Change" ? overpaymentAmount : 0;
  const carryForwardAmount = payment.overPaymentAction === "Carry Forward" ? overpaymentAmount : 0;

  const loadRooms = () => api.get("/admin/rooms").then((res) => {
    setRooms(res.data);
    if (!selectedRoomId && res.data.length) setSelectedRoomId(res.data[0]._id);
  });

  const loadBills = (roomId = selectedRoomId) => {
    if (!roomId) return setBills([]);
    return api.get(`/admin/room-bills/room/${roomId}`).then((res) => {
      setBills(res.data);
      setSelectedBillId(res.data[0]?._id || "");
      setShowPayment(false);
    });
  };

  useEffect(() => { loadRooms(); }, []);
  useEffect(() => { loadBills(selectedRoomId); }, [selectedRoomId]);

  const addPayment = async (e) => {
    e.preventDefault();
    if (!selectedBill) return;
    setError("");
    setMessage("");
    try {
      const { data } = await api.post("/admin/payments", {
        ...payment,
        paidAmount: payment.overPaymentAction === "Give Change" && overpaymentAmount > 0 ? fullBalance : receivedAmount,
        changeAmount,
        roomBillId: selectedBill._id
      });
      const balance = data.bill.currentBalance;
      if (data.payment.changeAmount > 0) {
        setMessage(`Payment saved. Give change ${money(data.payment.changeAmount)} to the boarder.`);
      } else {
        setMessage(balance < 0 ? `Payment saved. Credit ${money(Math.abs(balance))} will decrease the upcoming month bill.` : `Payment saved. Remaining balance ${money(balance)} will carry to the coming month if unpaid.`);
      }
      setPayment({ receivedAmount: "", overPaymentAction: "Give Change", paymentMethod: "Cash", paymentDate: new Date().toISOString().slice(0, 10), note: "" });
      setShowPayment(false);
      loadBills();
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed");
    }
  };

  const printBill = (bill) => {
    const carry = bill.currentBalance < 0 ? `Credit to next month: ${money(Math.abs(bill.currentBalance))}` : `Balance to next month: ${money(bill.currentBalance)}`;
    const html = `<html><body style="font-family:Arial;padding:30px"><h2>Room Bill ${bill.roomNumber}</h2><p>${monthLabel(bill.month)} / ${bill.year}</p><hr/><p>Boarder: ${bill.customerName}</p><p>Room Fee: ${money(bill.roomFee)}</p><p>Electricity Units: ${bill.electricityUsedUnits}</p><p>Electricity: ${money(bill.electricityBill)}</p><p>Previous Balance/Credit: ${money(bill.previousMonthBalance)}</p><h3>Total Bill: ${money(bill.totalBill)}</h3><p>Paid: ${money(bill.totalPaidAmount)}</p><h3>Current Balance: ${money(bill.currentBalance)}</h3><p>${carry}</p><p>Status: ${bill.paymentStatus}</p></body></html>`;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    w.print();
  };

  return (
    <>
      <div className="page-title">
        <div>
          <h2>Room Bills</h2>
          <p>Select a room to view its monthly full bill, take payment, and print.</p>
        </div>
        <Link className="btn" to="/admin/room-bills/generate"><Rows3 size={18} />Generate Bills</Link>
      </div>

      <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
        <section className="panel">
          <h3 className="mb-3 text-lg font-black">Select Room</h3>
          <div className="grid gap-2">
            {rooms.map((room) => (
              <button
                key={room._id}
                type="button"
                className={`flex items-center justify-between rounded-lg border p-3 text-left ${selectedRoomId === room._id ? "border-leaf bg-mint" : "border-[#dfe8e2] bg-white"}`}
                onClick={() => setSelectedRoomId(room._id)}
              >
                <span className="font-black">{room.roomNumber}</span>
                <span className="text-sm text-slate-600">{room.status}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="grid gap-5">
          {message && <div className="success">{message}</div>}
          {error && <div className="error">{error}</div>}

          <section className="panel">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="text-xl font-black">Room {selectedRoom?.roomNumber || "-"}</h3>
                <p className="text-sm text-slate-600">Choose a month bill for this room.</p>
              </div>
              <select className="input max-w-xs" value={selectedBill?._id || ""} onChange={(e) => { setSelectedBillId(e.target.value); setShowPayment(false); }}>
                {bills.map((bill) => <option key={bill._id} value={bill._id}>{monthLabel(bill.month)} / {bill.year} - {money(bill.currentBalance)} balance</option>)}
              </select>
            </div>

            {selectedBill ? (
              <>
                <div className="grid-cards mb-5">
                  <div className="stat-card"><div><p className="stat-title">Boarder</p><p className="stat-value text-xl">{selectedBill.customerName}</p></div></div>
                  <div className="stat-card"><div><p className="stat-title">Monthly Rent</p><p className="stat-value">{money(selectedBill.roomFee)}</p></div></div>
                  <div className="stat-card"><div><p className="stat-title">Electricity Fee</p><p className="stat-value">{money(selectedBill.electricityBill)}</p></div></div>
                  <div className="stat-card"><div><p className="stat-title">Previous Balance (+/-)</p><p className="stat-value">{signedMoney(selectedBill.previousMonthBalance)}</p></div></div>
                  <div className="stat-card"><div><p className="stat-title">Total Bill</p><p className="stat-value">{money(selectedBill.totalBill)}</p></div></div>
                  <div className="stat-card"><div><p className="stat-title">Paid Amount</p><p className="stat-value">{money(selectedBill.totalPaidAmount)}</p></div></div>
                  <div className="stat-card"><div><p className="stat-title">{selectedBill.currentBalance < 0 ? "Credit Balance" : "Full Balance"}</p><p className="stat-value">{money(selectedBill.currentBalance)}</p></div></div>
                  <div className="stat-card"><div><p className="stat-title">Status</p><div className="mt-3"><BillStatusBadge status={selectedBill.paymentStatus} /></div></div></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="btn" type="button" onClick={() => setShowPayment((value) => !value)}><Banknote size={18} />Pay</button>
                  <button className="btn secondary" type="button" onClick={() => printBill(selectedBill)}><Printer size={18} />Print</button>
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-[#dfe8e2] p-5 text-slate-600">No room bills found for this room. Generate a monthly bill first.</div>
            )}
          </section>

          {showPayment && selectedBill && (
            <form className="panel form-grid" onSubmit={addPayment}>
              <div className="field full">
                <h3 className="text-lg font-black">Pay Room {selectedBill.roomNumber} Bill</h3>
                <p className="text-sm text-slate-600">
                  Full balance: {money(selectedBill.currentBalance)}. Underpayment leaves a balance for the coming month. If the received amount is higher, choose whether to give change or decrease the upcoming month bill.
                </p>
              </div>
              <label className="field"><span>Amount Received</span><input className="input" type="number" min="1" value={payment.receivedAmount} onChange={(e) => setPayment({ ...payment, receivedAmount: e.target.value })} required /></label>
              <label className="field"><span>Payment Date</span><input className="input" type="date" value={payment.paymentDate} onChange={(e) => setPayment({ ...payment, paymentDate: e.target.value })} /></label>
              <label className="field"><span>Payment Method</span><select className="input" value={payment.paymentMethod} onChange={(e) => setPayment({ ...payment, paymentMethod: e.target.value })}><option>Cash</option><option>Bank Transfer</option><option>Online Payment</option><option>Other</option></select></label>
              <label className="field"><span>Note</span><input className="input" value={payment.note} onChange={(e) => setPayment({ ...payment, note: e.target.value })} /></label>
              {overpaymentAmount > 0 && fullBalance > 0 && (
                <div className="field full rounded-lg border border-[#dfe8e2] bg-[#f7faf6] p-4">
                  <span>Overpayment Option</span>
                  <p className="mb-3 text-sm text-slate-600">Extra amount: {money(overpaymentAmount)}</p>
                  <div className="grid gap-2 md:grid-cols-2">
                    <label className={`rounded-lg border p-3 ${payment.overPaymentAction === "Give Change" ? "border-leaf bg-mint" : "border-[#dfe8e2] bg-white"}`}>
                      <input className="mr-2" type="radio" name="overPaymentAction" checked={payment.overPaymentAction === "Give Change"} onChange={() => setPayment({ ...payment, overPaymentAction: "Give Change" })} />
                      Give change: {money(changeAmount)}
                    </label>
                    <label className={`rounded-lg border p-3 ${payment.overPaymentAction === "Carry Forward" ? "border-leaf bg-mint" : "border-[#dfe8e2] bg-white"}`}>
                      <input className="mr-2" type="radio" name="overPaymentAction" checked={payment.overPaymentAction === "Carry Forward"} onChange={() => setPayment({ ...payment, overPaymentAction: "Carry Forward" })} />
                      Decrease upcoming month: {money(carryForwardAmount)}
                    </label>
                  </div>
                </div>
              )}
              <div className="field full flex gap-2"><button className="btn">Save Payment</button><button type="button" className="btn secondary" onClick={() => setShowPayment(false)}>Cancel</button></div>
            </form>
          )}

          <section className="panel">
            <h3 className="mb-3 text-lg font-black">Previous Room Bills</h3>
            <div className="table-wrap">
              <table className="data-table mobile-cards">
                <thead><tr><th>Month</th><th>Monthly Rent</th><th>Electricity Fee</th><th>Previous Balance (+/-)</th><th>Total</th><th>Paid</th><th>Balance/Credit</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {bills.map((bill) => (
                    <tr key={bill._id}>
                      <td data-label="Month">{monthLabel(bill.month)} / {bill.year}</td>
                      <td data-label="Monthly Rent">{money(bill.roomFee)}</td>
                      <td data-label="Electricity Fee">{money(bill.electricityBill)}</td>
                      <td data-label="Previous Balance">{signedMoney(bill.previousMonthBalance)}</td>
                      <td data-label="Total">{money(bill.totalBill)}</td>
                      <td data-label="Paid">{money(bill.totalPaidAmount)}</td>
                      <td data-label="Balance/Credit">{signedMoney(bill.currentBalance)}</td>
                      <td data-label="Status"><BillStatusBadge status={bill.paymentStatus} /></td>
                      <td data-label="Action"><button className="btn secondary" type="button" onClick={() => { setSelectedBillId(bill._id); setShowPayment(false); }}>View</button></td>
                    </tr>
                  ))}
                  {!bills.length && <tr><td colSpan="9">No bills found for this room.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default RoomBills;
