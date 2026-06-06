import { Building2, ShieldCheck, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

const LoginChoice = () => (
  <main className="auth-page">
    <div className="auth-glow gold" />
    <div className="auth-glow green" />
    <section className="auth-shell" style={{ maxWidth: 1120 }}>
      <div className="auth-hero" style={{ minHeight: 540 }}>
        <div className="auth-hero-content">
          <div className="auth-brand">
            <div className="brand-mark">BH</div>
            <div>
              <div className="auth-kicker">Boarding house portal</div>
              <h1 style={{ marginTop: 14, fontSize: 22 }}>Boarding House Management System</h1>
              <p>Separate portals for administration and boarders, designed to keep room operations clear and fast.</p>
            </div>
          </div>

          <div>
            <h2>Choose the portal that matches your role.</h2>
            <p style={{ marginTop: 18, maxWidth: 520, fontSize: 16, lineHeight: 1.7 }}>
              Manage rooms, billing, and payment records from one side, or access your own room information from the other.
            </p>
          </div>

          <div className="auth-proof">
            <div className="auth-proof-grid">
              <div className="auth-proof-card">
                <strong>Rooms</strong>
                <span>Track occupancy and room assignments.</span>
              </div>
              <div className="auth-proof-card">
                <strong>Bills</strong>
                <span>Follow monthly billing and balances.</span>
              </div>
              <div className="auth-proof-card">
                <strong>Payments</strong>
                <span>Review receipts and history instantly.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-card-header">
          <div className="auth-portal-meta">
            <Building2 size={14} />
            Secure access
          </div>
          <div>
            <h2 className="auth-title" style={{ fontSize: 30 }}>Select your login</h2>
            <p>Choose the portal you need right now.</p>
          </div>
        </div>

        <div className="auth-portal-grid">
          <Link className="auth-portal-link" to="/admin/login">
            <div style={{ color: "var(--green)" }}><ShieldCheck size={34} /></div>
            <div>
              <h2>Admin Login</h2>
              <p>Manage rooms, boarders, electricity, bills, payments, and reports.</p>
            </div>
          </Link>

          <Link className="auth-portal-link" to="/customer/login">
            <div style={{ color: "var(--green)" }}><UserRound size={34} /></div>
            <div>
              <h2>Boarder Login</h2>
              <p>View room bills, payment history, and update contact numbers.</p>
            </div>
          </Link>
        </div>

        <div className="auth-note">
          <Building2 size={16} />
          <span>Room bills remain room-based; payments remain attached to room bills.</span>
        </div>
      </div>
    </section>
  </main>
);

export default LoginChoice;
