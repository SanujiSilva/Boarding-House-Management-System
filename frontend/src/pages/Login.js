import { useState } from "react";
import { Building2, Eye, EyeOff, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Login = ({ role = "admin" }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isAdmin = role === "admin";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      if (data.user.role !== role) {
        setError(`Please use the ${data.user.role} login page for this account.`);
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate(role === "admin" ? "/admin/dashboard" : "/customer/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8f4] grid place-items-center p-5">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-[#dfe8e2] bg-white shadow-xl md:grid-cols-[1fr_420px]">
        <div className="relative min-h-[520px] bg-[#17211b] p-8 text-white">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(135deg, #d3a42f 0 1px, transparent 1px)", backgroundSize: "34px 34px" }} />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="brand">
              <div className="brand-mark">BH</div>
              <div>
                <h1>Boarding House Management System</h1>
                <p>Room billing, payments, boarders</p>
              </div>
            </div>
            <div>
              <Building2 size={56} className="mb-5 text-[#d3a42f]" />
              <h2 className="max-w-lg text-4xl font-black leading-tight">
                {isAdmin ? "Admin workspace for rooms, bills, boarders, and payments." : "Boarder access for room bills, payments, and contact details."}
              </h2>
              <p className="mt-4 max-w-md text-[#c8d8ce]">{isAdmin ? "Default admin: admin / admin123" : "Use your email as username and phone number as password."}</p>
            </div>
          </div>
        </div>
        <form onSubmit={submit} className="grid content-center gap-4 p-8">
          <div>
            <h2 className="text-2xl font-black">{isAdmin ? "Admin Login" : "Boarder Login"}</h2>
            <p className="mt-1 text-sm text-slate-600">{isAdmin ? "Sign in to manage the boarding house." : "Use email as username and phone number as password."}</p>
          </div>
          {error && <div className="error">{error}</div>}
          <label className="field">
            <span>{isAdmin ? "Username" : "Email"}</span>
            <input className="input" type={isAdmin ? "text" : "email"} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          </label>
          <label className="field">
            <span>{isAdmin ? "Password" : "Phone Number"}</span>
            <div className="relative">
              <input
                className="input pr-12"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-leaf"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
          <button className="btn" disabled={loading}>
            <LogIn size={18} />
            {loading ? "Signing in..." : "Login"}
          </button>
          <Link className="text-sm font-bold text-leaf" to={isAdmin ? "/customer/login" : "/admin/login"}>
            {isAdmin ? "Boarder login" : "Admin login"}
          </Link>
        </form>
      </section>
    </main>
  );
};

export default Login;
