import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import api from "../../api/axios";

const Profile = () => {
  const [form, setForm] = useState({ phoneNumber: "", whatsappNumber: "" });
  const [customer, setCustomer] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/customer/dashboard").then((res) => {
      setCustomer(res.data.customer);
      setForm({ phoneNumber: res.data.customer.phoneNumber || "", whatsappNumber: res.data.customer.whatsappNumber || "" });
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const { data } = await api.put("/customer/update-contact", form);
      setCustomer(data);
      setMessage("Contact details updated");
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed");
    }
  };

  return (
    <>
      <div className="page-title"><div><h2>Profile</h2><p>Only contact numbers can be updated from the boarder side.</p></div></div>
      <section className="panel mb-5">
        <div className="grid gap-4 md:grid-cols-3">
          <p><b>Name:</b> {customer?.name}</p>
          <p><b>Room:</b> {customer?.roomNumber}</p>
          <p><b>NIC:</b> {customer?.nicNumber}</p>
        </div>
      </section>
      <form className="panel form-grid" onSubmit={submit}>
        {message && <div className="success full">{message}</div>}
        {error && <div className="error full">{error}</div>}
        <label className="field"><span>Phone Number</span><input className="input" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} required /></label>
        <label className="field"><span>WhatsApp Number</span><input className="input" value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} /></label>
        <div className="field full"><button className="btn"><Save size={18} />Save Contact Details</button></div>
      </form>
    </>
  );
};

export default Profile;
