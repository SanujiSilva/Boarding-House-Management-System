import { useEffect, useState } from "react";
import { Save, ShieldCheck } from "lucide-react";
import api from "../../api/axios";

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ name: "", username: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = () => api.get("/admin/admins").then((res) => setAdmins(res.data));
  useEffect(() => { load(); }, []);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.post("/admin/admins", form);
      setForm({ name: "", username: "", password: "" });
      setMessage("Admin account created");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Admin account creation failed");
    }
  };

  return (
    <>
      <div className="page-title">
        <div><h2>Admin Accounts</h2><p>Create another admin account and view existing admins.</p></div>
      </div>
      <form className="panel form-grid mb-5" onSubmit={submit}>
        {message && <div className="success full">{message}</div>}
        {error && <div className="error full">{error}</div>}
        <label className="field"><span>Name</span><input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} required /></label>
        <label className="field"><span>Username</span><input className="input" value={form.username} onChange={(e) => set("username", e.target.value)} required /></label>
        <label className="field"><span>Password</span><input className="input" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} required /></label>
        <div className="field full"><button className="btn"><Save size={18} />Create Admin</button></div>
      </form>
      <section className="panel">
        <h3 className="mb-3 text-lg font-black">Existing Admins</h3>
        <div className="table-wrap">
          <table className="data-table mobile-cards">
            <thead><tr><th>Name</th><th>Username</th><th>Status</th><th>Created</th></tr></thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id}>
                  <td data-label="Name"><div className="flex items-center gap-2"><ShieldCheck size={16} />{admin.name}</div></td>
                  <td data-label="Username">{admin.username}</td>
                  <td data-label="Status">{admin.isActive ? "Active" : "Inactive"}</td>
                  <td data-label="Created">{new Date(admin.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Admins;
