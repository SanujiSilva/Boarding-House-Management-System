import { useEffect, useState } from "react";
import { Banknote, BedDouble, Receipt, TrendingDown, TrendingUp, WalletCards } from "lucide-react";
import api from "../../api/axios";
import StatCard from "../../components/StatCard";
import BillStatusBadge from "../../components/BillStatusBadge";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;
const signedMoney = (value) => {
  const number = Number(value || 0);
  if (number > 0) return `+ ${money(number)}`;
  if (number < 0) return `- ${money(Math.abs(number))}`;
  return money(0);
};

const CustomerDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/customer/dashboard").then((res) => setData(res.data));
  }, []);

  const bill = data?.currentBill;

  return (
    <>
      <div className="page-title">
        <div>
          <h2 style={{ background: "linear-gradient(135deg, #6ba88f 0%, #507568 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Welcome, {data?.customer?.name || "Boarder"}</h2>
          <p>Room {data?.customer?.roomNumber || "-"} · Current month billing</p>
        </div>
        {bill && <BillStatusBadge status={bill.paymentStatus} />}
      </div>

      {bill ? (
        <>
          {/* Bill Breakdown Cards */}
          <div className="grid-cards mb-5">
            <StatCard title="Monthly Rent" value={money(bill?.roomFee)} icon={BedDouble} />
            <StatCard title="Electricity" value={money(bill?.electricityBill)} icon={Receipt} tone="gold" />
            <StatCard title="Previous Balance" value={signedMoney(bill?.previousMonthBalance)} icon={bill?.previousMonthBalance > 0 ? TrendingUp : TrendingDown} tone={bill?.previousMonthBalance > 0 ? "coral" : "leaf"} />
            <StatCard title="Total Bill" value={money(bill?.totalBill)} icon={Receipt} />
            <StatCard title="Amount Paid" value={money(bill?.totalPaidAmount)} icon={Banknote} tone="leaf" />
            <StatCard title="Current Balance" value={signedMoney(bill?.currentBalance)} icon={WalletCards} tone={bill?.currentBalance > 0 ? "coral" : "leaf"} />
          </div>

          {/* Bill Summary Card */}
          <section className="panel">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ width: "4px", height: "24px", borderRadius: "2px", background: "linear-gradient(135deg, #6ba88f 0%, #507568 100%)" }}></div>
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "900", color: "#0f1410" }}>Bill Summary</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div style={{ padding: "18px", borderRadius: "16px", background: "linear-gradient(135deg, rgba(107, 168, 143, 0.12) 0%, rgba(90, 154, 126, 0.08) 100%)", border: "1px solid rgba(107, 168, 143, 0.25)" }}>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#6ba88f", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>Monthly Rent</p>
                <p style={{ fontSize: "24px", fontWeight: "900", color: "#507568", marginTop: "8px" }}>{money(bill?.roomFee)}</p>
              </div>
              <div style={{ padding: "18px", borderRadius: "16px", background: "linear-gradient(135deg, rgba(201, 169, 97, 0.12) 0%, rgba(172, 143, 74, 0.08) 100%)", border: "1px solid rgba(201, 169, 97, 0.25)" }}>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#c9a961", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>Electricity</p>
                <p style={{ fontSize: "24px", fontWeight: "900", color: "#a88a55", marginTop: "8px" }}>{money(bill?.electricityBill)}</p>
              </div>
              <div style={{ padding: "18px", borderRadius: "16px", background: "linear-gradient(135deg, rgba(123, 167, 212, 0.12) 0%, rgba(95, 131, 183, 0.08) 100%)", border: "1px solid rgba(123, 167, 212, 0.25)" }}>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#7ba7d4", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Bill</p>
                <p style={{ fontSize: "24px", fontWeight: "900", color: "#5f83b7", marginTop: "8px" }}>{money(bill?.totalBill)}</p>
              </div>
              <div style={{ padding: "18px", borderRadius: "16px", background: "linear-gradient(135deg, rgba(107, 168, 143, 0.12) 0%, rgba(90, 154, 126, 0.08) 100%)", border: "1px solid rgba(107, 168, 143, 0.25)" }}>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#6ba88f", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>Amount Paid</p>
                <p style={{ fontSize: "24px", fontWeight: "900", color: "#507568", marginTop: "8px" }}>{money(bill?.totalPaidAmount)}</p>
              </div>
              <div style={{ padding: "18px", borderRadius: "16px", background: bill?.currentBalance > 0 ? "linear-gradient(135deg, rgba(217, 125, 110, 0.12) 0%, rgba(185, 93, 75, 0.08) 100%)" : "linear-gradient(135deg, rgba(107, 168, 143, 0.12) 0%, rgba(90, 154, 126, 0.08) 100%)", border: bill?.currentBalance > 0 ? "1px solid rgba(217, 125, 110, 0.25)" : "1px solid rgba(107, 168, 143, 0.25)" }}>
                <p style={{ fontSize: "13px", fontWeight: "600", color: bill?.currentBalance > 0 ? "#d97d6e" : "#6ba88f", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {bill?.currentBalance > 0 ? "Outstanding" : "Paid"}
                </p>
                <p style={{ fontSize: "24px", fontWeight: "900", color: bill?.currentBalance > 0 ? "#b95d4f" : "#507568", marginTop: "8px" }}>{signedMoney(bill?.currentBalance)}</p>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="panel">
          <div className="empty-state">
            <Receipt size={68} />
            <strong>No Bill Generated Yet</strong>
            <p>A bill for your room will be generated at the start of the next billing cycle.</p>
          </div>
        </section>
      )}
    </>
  );
};

export default CustomerDashboard;
