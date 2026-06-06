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
        <div><h2>Boarders</h2><p>Each boarder is shown as a separate room member.</p></div>
        <Link className="btn" to="/admin/customers/add"><UserRoundPlus size={18} />Register Boarder</Link>
      </div>
      <section className="panel">
        <div className="mb-4 flex flex-wrap gap-2">
          <input className="input max-w-sm" placeholder="Search boarders" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn secondary" onClick={load}><Search size={18} />Search</button>
          <div className="flex rounded-lg border border-[#cad8cf] bg-white p-1">
            {[
              ["active", "Current Members"],
              ["previous", "Previous Members"],
              ["all", "All"]
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`rounded-md px-3 py-2 text-sm font-bold ${status === value ? "bg-leaf text-white" : "text-slate-700"}`}
                onClick={() => setStatus(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Boarder</th><th>Room</th><th>Phone</th><th>NIC</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.roomNumber}</td>
                  <td>{customer.phoneNumber}</td>
                  <td>{customer.nicNumber}</td>
                  <td>{customer.isActive ? "Active" : "Inactive"}</td>
                  <td>
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
