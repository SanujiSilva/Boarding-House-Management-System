const tone = {
  Paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Partially Paid": "bg-amber-100 text-amber-800 border-amber-200",
  Unpaid: "bg-rose-100 text-rose-800 border-rose-200"
};

const BillStatusBadge = ({ status }) => (
  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${tone[status] || tone.Unpaid}`}>
    {status || "Unpaid"}
  </span>
);

export default BillStatusBadge;

