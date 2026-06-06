import { useEffect, useState } from "react";
import { RefreshCw, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const AddRoom = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({ roomNumber: "", monthlyRent: "", maxBoarders: 1, description: "" });
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const loadNextNumber = async () => {
    const { data } = await api.get("/admin/rooms/next-number");
    set("roomNumber", data.roomNumber);
  };

  useEffect(() => {
    loadNextNumber().catch(() => setError("Could not generate room number"));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/admin/rooms", {
        roomNumber: form.roomNumber,
        monthlyRent: form.monthlyRent,
        maxBoarders: form.maxBoarders,
        description: form.description,
        roomType: "Standard",
        currentBoarders: 0
      });
      navigate("/admin/rooms");
    } catch (err) {
      setError(err.response?.data?.message || "Room save failed");
    }
  };

  return (
    <>
      <div className="page-title">
        <div>
          <h2>Add Room</h2>
          <p>Room number is generated automatically from the latest room.</p>
        </div>
      </div>
      <form className="panel form-grid" onSubmit={submit}>
        {error && <div className="error full">{error}</div>}
        <label className="field">
          <span>Room Number</span>
          <div className="flex gap-2">
            <input className="input" value={form.roomNumber} onChange={(e) => set("roomNumber", e.target.value)} required />
            <button className="btn secondary" type="button" title="Regenerate room number" onClick={loadNextNumber}>
              <RefreshCw size={16} />
            </button>
          </div>
        </label>
        <label className="field">
          <span>Monthly Rental</span>
          <input className="input" type="number" min="0" value={form.monthlyRent} onChange={(e) => set("monthlyRent", e.target.value)} required />
        </label>
        <label className="field">
          <span>Room Capacity</span>
          <input className="input" type="number" min="1" value={form.maxBoarders} onChange={(e) => set("maxBoarders", e.target.value)} required />
        </label>
        <label className="field full">
          <span>Description</span>
          <textarea className="input" value={form.description} onChange={(e) => set("description", e.target.value)} />
        </label>
        <div className="field full">
          <button className="btn"><Save size={18} />Save Room</button>
        </div>
      </form>
    </>
  );
};

export default AddRoom;
