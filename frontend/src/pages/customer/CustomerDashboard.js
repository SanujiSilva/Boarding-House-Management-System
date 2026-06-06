import { useEffect, useState } from "react";
import { Banknote, BedDouble, Receipt, WalletCards } from "lucide-react";
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
          <h2>{data?.customer?.name || "Boarder Dashboard"}</h2>
          <p>Room {data?.customer?.roomNumber || "-"} current month billing.</p>
        </div>
        {bill && <BillStatusBadge status={bill.paymentStatus} />}
      </div>
      <div className="grid-cards">
        <StatCard title="Monthly Rent" value={money(bill?.roomFee)} icon={BedDouble} />
        <StatCard title="Electricity Fee" value={money(bill?.electricityBill)} icon={Receipt} tone="gold" />
        <StatCard title="Previous Balance (+/-)" value={signedMoney(bill?.previousMonthBalance)} icon={WalletCards} tone="coral" />
        <StatCard title="Total Bill" value={money(bill?.totalBill)} icon={Receipt} />
        <StatCard title="Paid Amount" value={money(bill?.totalPaidAmount)} icon={Banknote} tone="gold" />
        <StatCard title="Current Balance" value={signedMoney(bill?.currentBalance)} icon={WalletCards} tone="coral" />
      </div>
      {!bill && <div className="panel mt-5">No current month bill has been generated for your room yet.</div>}
    </>
  );
};

export default CustomerDashboard;
