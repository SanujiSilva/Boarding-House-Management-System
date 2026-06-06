import { useState } from "react";
import { Building2, CalendarDays, Eye, EyeOff, KeyRound, LogIn, ShieldCheck, Sparkles } from "lucide-react";
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
    <main className="auth-page">
      <div className="auth-glow gold" />
      <div className="auth-glow green" />
      <section className="auth-shell two-column">
        <div className="auth-hero">
          <div className="auth-hero-content">
            <div className="auth-brand">
              <div className="brand-mark">BH</div>
              <div>
                <div className="auth-kicker">{isAdmin ? "Admin portal" : "Boarder portal"}</div>
                <h1 style={{ marginTop: 14, fontSize: 22 }}>Boarding House Management System</h1>
                <p>{isAdmin ? "Room billing, boarders, payments, and reports in one workspace." : "A simple portal for your bills, payments, and personal room details."}</p>
              </div>
            </div>

            <div>
              <h2>{isAdmin ? "Manage the entire house from a focused dashboard." : "Check your room records without the clutter."}</h2>
              <p style={{ marginTop: 18, maxWidth: 560, fontSize: 16, lineHeight: 1.7 }}>
                {isAdmin
                  ? "Keep occupancy, bills, and payment records in sync while moving quickly through your daily tasks."
                  : "Use your email as the username and your phone number as the password to access your room information."}
              </p>
            </div>

            <div className="auth-proof">
              <div className="auth-proof-grid">
                <div className="auth-proof-card">
                  <ShieldCheck size={18} style={{ marginBottom: 10 }} />
                  <strong>Secure</strong>
                  <span>Role-based login keeps access separated.</span>
                </div>
                <div className="auth-proof-card">
                  <CalendarDays size={18} style={{ marginBottom: 10 }} />
                  <strong>Timed</strong>
                  <span>See registered dates and bill timelines.</span>
                </div>
                <div className="auth-proof-card">
                  <Sparkles size={18} style={{ marginBottom: 10 }} />
                  <strong>Clear</strong>
                  <span>A cleaner surface for fast everyday use.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="auth-card">
          <div className="auth-card-header">
            <div className="auth-portal-meta">
              <KeyRound size={14} />
              Protected access
            </div>
            <div>
              <h2 className="auth-title">{isAdmin ? "Admin Login" : "Boarder Login"}</h2>
              <p>{isAdmin ? "Sign in to manage the boarding house." : "Sign in to view your boarder information."}</p>
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <label className="field">
            <span>{isAdmin ? "Username" : "Email"}</span>
            <input className="input" type={isAdmin ? "text" : "email"} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          </label>

          <label className="field">
            <span>{isAdmin ? "Password" : "Phone Number"}</span>
            <div className="input-wrap">
              <input
                className="input with-icon"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="input-icon-btn"
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

          <Link className="text-sm font-bold" style={{ color: "var(--green)" }} to={isAdmin ? "/customer/login" : "/admin/login"}>
            {isAdmin ? "Boarder login" : "Admin login"}
          </Link>
        </form>
      </section>
    </main>
  );
};

export default Login;
