import { Building2, ShieldCheck, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

const LoginChoice = () => (
  <main className="min-h-screen bg-[#f6f8f4] grid place-items-center p-5">
    <section className="w-full max-w-3xl rounded-lg border border-[#dfe8e2] bg-white p-8 shadow-xl">
      <div className="mb-8 flex items-center gap-3">
        <div className="brand-mark">BH</div>
        <div>
          <h1 className="text-2xl font-black">Boarding House Management System</h1>
          <p className="text-slate-600">Choose your login portal.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Link className="rounded-lg border border-[#dfe8e2] p-5 text-inherit no-underline transition hover:border-leaf hover:shadow-lg" to="/admin/login">
          <ShieldCheck className="mb-4 text-leaf" size={34} />
          <h2 className="text-xl font-black">Admin Login</h2>
          <p className="mt-2 text-sm text-slate-600">Manage rooms, boarders, electricity, bills, payments, and reports.</p>
        </Link>
        <Link className="rounded-lg border border-[#dfe8e2] p-5 text-inherit no-underline transition hover:border-leaf hover:shadow-lg" to="/customer/login">
          <UserRound className="mb-4 text-leaf" size={34} />
          <h2 className="text-xl font-black">Boarder Login</h2>
          <p className="mt-2 text-sm text-slate-600">View room bills, payment history, and update contact numbers.</p>
        </Link>
      </div>
      <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">
        <Building2 size={16} />
        <span>Room bills remain room-based; payments remain attached to room bills.</span>
      </div>
    </section>
  </main>
);

export default LoginChoice;
