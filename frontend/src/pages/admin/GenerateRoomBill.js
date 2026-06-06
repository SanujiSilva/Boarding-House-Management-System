import { useEffect, useState } from "react";
import { Play, Rows3 } from "lucide-react";
import api from "../../api/axios";
import { monthOptions } from "../../utils/months";

const GenerateRoomBill = () => {
  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ roomId: "", month: new Date().getMonth() + 1, year: new Date().getFullYear(), note: "" });

  useEffect(() => {
    api.get("/admin/rooms").then((res) => setRooms(res.data.filter((room) => ["Occupied", "Full"].includes(room.status))));
  }, []);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const generateOne = async () => {
    setError("");
    setMessage("");
    try {
      const { data } = await api.post("/admin/room-bills/generate", form);
      setMessage(`Generated bill for ${data.roomNumber}`);
    } catch (err) {
      setError(err.response?.data?.message || "Bill generation failed");
    }
  };

  const generateAll = async () => {
    setError("");
    setMessage("");
    try {
      const { data } = await api.post("/admin/room-bills/generate-all", { month: form.month, year: form.year, note: form.note });
      setMessage(`Generated ${data.generatedCount} bill(s), skipped ${data.skippedCount}.`);
    } catch (err) {
      setError(err.response?.data?.message || "Bulk generation failed");
    }
  };

  return (
    <>
      <div className="page-title"><div><h2>Generate Room Bills</h2><p>Create one monthly bill per occupied or full room.</p></div></div>
      <section className="panel form-grid">
        {error && <div className="error full">{error}</div>}
        {message && <div className="success full">{message}</div>}
        <label className="field"><span>Month</span><select className="input" value={form.month} onChange={(e) => set("month", e.target.value)}>{monthOptions.map((month) => <option key={month.value} value={month.value}>{month.label}</option>)}</select></label>
        <label className="field"><span>Year</span><input className="input" type="number" value={form.year} onChange={(e) => set("year", e.target.value)} /></label>
        <label className="field"><span>Room Number</span><select className="input" value={form.roomId} onChange={(e) => set("roomId", e.target.value)}><option value="">Select room</option>{rooms.map((room) => <option key={room._id} value={room._id}>{room.roomNumber}</option>)}</select></label>
        <label className="field"><span>Note</span><input className="input" value={form.note} onChange={(e) => set("note", e.target.value)} /></label>
        <div className="field full flex flex-wrap gap-2">
          <button className="btn" type="button" onClick={generateOne} disabled={!form.roomId}><Play size={18} />Generate Selected Room</button>
          <button className="btn secondary" type="button" onClick={generateAll}><Rows3 size={18} />Generate All Rooms</button>
        </div>
      </section>
    </>
  );
};

export default GenerateRoomBill;
