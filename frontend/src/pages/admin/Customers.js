import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Search, Trash2, UserRoundPlus } from "lucide-react";
import api from "../../api/axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");

  const load = () => api.get("/admin/customers", { params: { search, status } }).then((res) => setCustomers(res.data));
  useEffect(() => { load(); }, [status]);

  const deactivate = async (id) => {
    if (!confirm("Deactivate this boarder?")) return;
    await api.delete(`/admin/customers/${id}`);
    load();
  };

  return (
    <>
      <div className="page-title">
        <div><h2 style={{ background: "linear-gradient(135deg, #6ba88f 0%, #507568 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Boarders</h2><p>Each boarder is shown as a separate room member.</p></div>
        <Link className="btn" to="/admin/customers/add"><UserRoundPlus size={18} />Register Boarder</Link>
      </div>
      <section className="panel">
        <div className="mb-4 flex flex-wrap gap-2">
          <input className="input max-w-sm" placeholder="Search boarders" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn secondary" onClick={load}><Search size={18} />Search</button>
          <div className="flex rounded-lg border" style={{ borderColor: "rgba(148, 163, 153, 0.35)", background: "white", padding: "4px" }}>
            {[
              ["active", "Current Members"],
              ["previous", "Previous Members"],
              ["all", "All"]
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                style={{
                  borderRadius: "8px",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  paddingTop: "8px",
                  paddingBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  background: status === value ? "linear-gradient(135deg, #6ba88f 0%, #507568 100%)" : "transparent",
                  color: status === value ? "white" : "#5a6a5f",
                  border: "0",
                  cursor: "pointer",
                  transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)"
                }}
                onClick={() => setStatus(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table mobile-cards">
            <thead><tr><th>Boarder</th><th>Room</th><th>Phone</th><th>NIC</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td data-label="Boarder">{customer.name}</td>
                  <td data-label="Room">{customer.roomNumber}</td>
                  <td data-label="Phone">{customer.phoneNumber}</td>
                  <td data-label="NIC">{customer.nicNumber}</td>
                  <td data-label="Status"><span style={{ display: "inline-flex", borderRadius: "20px", paddingLeft: "12px", paddingRight: "12px", paddingTop: "6px", paddingBottom: "6px", fontSize: "13px", fontWeight: "900", background: customer.isActive ? "linear-gradient(135deg, rgba(107, 168, 143, 0.15) 0%, rgba(90, 154, 126, 0.1) 100%)" : "linear-gradient(135deg, rgba(229, 231, 235, 0.5) 0%, rgba(209, 213, 219, 0.4) 100%)", color: customer.isActive ? "#6ba88f" : "#757f7a", border: customer.isActive ? "1px solid rgba(107, 168, 143, 0.25)" : "1px solid rgba(157, 166, 161, 0.3)" }}>{customer.isActive ? "Active" : "Inactive"}</span></td>
                  <td data-label="Actions">
                    <div className="flex gap-2">
                      <Link className="btn secondary" title="View boarder" to={`/admin/customers/${customer._id}`}><Eye size={16} /></Link>
                      <Link className="btn secondary" title="Edit boarder" to={`/admin/customers/edit/${customer._id}`}><Pencil size={16} /></Link>
                      <button className="btn danger" title="Deactivate boarder" onClick={() => deactivate(customer._id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!customers.length && <tr><td colSpan="6">No boarders found.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Customers;
