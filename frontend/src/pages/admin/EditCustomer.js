import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { validatePhoneNumber, validateNICNumber } from "../../utils/validations";

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    api.get("/admin/rooms").then((res) => setRooms(res.data));
    api.get(`/admin/customers/${id}`).then((res) => setForm(res.data.customer));
  }, [id]);

  if (!form) return null;
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    // Validate phone number
    const phoneValidation = validatePhoneNumber(form.phoneNumber);
    if (!phoneValidation.valid) {
      setFieldErrors((prev) => ({ ...prev, phoneNumber: phoneValidation.message }));
      return;
    }

    // Validate NIC number
    const nicValidation = validateNICNumber(form.nicNumber);
    if (!nicValidation.valid) {
      setFieldErrors((prev) => ({ ...prev, nicNumber: nicValidation.message }));
      return;
    }

    // Validate WhatsApp if provided
    if (form.whatsappNumber?.trim()) {
      const whatsappValidation = validatePhoneNumber(form.whatsappNumber);
      if (!whatsappValidation.valid) {
        setFieldErrors((prev) => ({ ...prev, whatsappNumber: whatsappValidation.message }));
        return;
      }
    }

    try {
      await api.put(`/admin/customers/${id}`, { ...form, numberOfBoardersInRoom: 0, boarderDetails: [] });
      navigate(`/admin/customers/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Boarder update failed");
    }
  };

  return (
    <>
      <div className="page-title"><div><h2>Edit Boarder</h2><p>Update this boarder's details and room assignment.</p></div></div>
      <form className="panel form-grid" onSubmit={submit}>
        {error && <div className="error full">{error}</div>}
        <label className="field"><span>Name</span><input className="input" value={form.name || ""} onChange={(e) => set("name", e.target.value)} required /></label>
        <label className="field"><span>Email</span><input className="input" type="email" value={form.email || form.userId?.username || ""} onChange={(e) => set("email", e.target.value)} required /></label>
        <label className="field">
          <span>NIC Number</span>
          <input className="input" value={form.nicNumber || ""} onChange={(e) => set("nicNumber", e.target.value)} placeholder="e.g., 123456789v or 123456789012" required />
          {fieldErrors.nicNumber && <p style={{ color: "#d97d6e", fontSize: "12px", marginTop: "4px", fontWeight: "600" }}>{fieldErrors.nicNumber}</p>}
        </label>
        <label className="field">
          <span>Phone Number</span>
          <input className="input" value={form.phoneNumber || ""} onChange={(e) => set("phoneNumber", e.target.value)} placeholder="e.g., 0712345678 or +94712345678" required />
          {fieldErrors.phoneNumber && <p style={{ color: "#d97d6e", fontSize: "12px", marginTop: "4px", fontWeight: "600" }}>{fieldErrors.phoneNumber}</p>}
        </label>
        <label className="field">
          <span>WhatsApp Number</span>
          <input className="input" value={form.whatsappNumber || ""} onChange={(e) => set("whatsappNumber", e.target.value)} placeholder="Optional - e.g., 0712345678" />
          {fieldErrors.whatsappNumber && <p style={{ color: "#d97d6e", fontSize: "12px", marginTop: "4px", fontWeight: "600" }}>{fieldErrors.whatsappNumber}</p>}
        </label>
        <label className="field"><span>Relationship</span><input className="input" value={form.relationship || ""} onChange={(e) => set("relationship", e.target.value)} /></label>
        <label className="field"><span>Job</span><input className="input" value={form.job || ""} onChange={(e) => set("job", e.target.value)} /></label>
        <label className="field"><span>Room</span><select className="input" value={form.roomId?._id || form.roomId} onChange={(e) => set("roomId", e.target.value)}>{rooms.map((room) => <option key={room._id} value={room._id}>{room.roomNumber} ({room.currentBoarders}/{room.maxBoarders})</option>)}</select></label>
        <label className="field"><span>Room Fee</span><input className="input" type="number" value={form.roomFee || ""} onChange={(e) => set("roomFee", e.target.value)} required /></label>
        <label className="field"><span>Married Status</span><select className="input" value={form.marriedStatus} onChange={(e) => set("marriedStatus", e.target.value)}><option>Single</option><option>Married</option></select></label>
        <label className="field"><span>Active</span><select className="input" value={String(form.isActive)} onChange={(e) => set("isActive", e.target.value === "true")}><option value="true">Active</option><option value="false">Inactive</option></select></label>
        <label className="field full"><span>Address</span><textarea className="input" value={form.address || ""} onChange={(e) => set("address", e.target.value)} /></label>
        <div className="field full"><button className="btn"><Save size={18} />Save Changes</button></div>
      </form>
    </>
  );
};

export default EditCustomer;
