import { useEffect, useMemo, useState } from "react";
import { Building2, Save } from "lucide-react";
import api from "../../api/axios";
import { monthLabel, monthOptions } from "../../utils/months";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

const Electricity = () => {
  const [rooms, setRooms] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    previousMeterReading: "",
    currentMeterReading: "",
    unitPrice: 65
  });

  const selectedRoom = useMemo(() => rooms.find((room) => room._id === selectedRoomId), [rooms, selectedRoomId]);
  const previousReadingSource = useMemo(() => {
    const month = Number(form.month);
    const year = Number(form.year);
    if (!month || !year) return null;
    const prev = month === 1 ? { month: 12, year: year - 1 } : { month: month - 1, year };
    return records.find((record) => record.month === prev.month && record.year === prev.year) || null;
  }, [records, form.month, form.year]);
  const calculatedUnits = Number(form.currentMeterReading || 0) - Number(form.previousMeterReading || 0);

  const loadRooms = () => api.get("/admin/rooms").then((res) => {
    setRooms(res.data);
    if (!selectedRoomId && res.data.length) setSelectedRoomId(res.data[0]._id);
  });

  const loadRecords = (roomId = selectedRoomId) => {
    if (!roomId) return setRecords([]);
    return api.get(`/admin/electricity/room/${roomId}`).then((res) => setRecords(res.data));
  };

  useEffect(() => { loadRooms(); }, []);
  useEffect(() => { loadRecords(selectedRoomId); }, [selectedRoomId]);
  useEffect(() => {
    setForm((current) => ({
      ...current,
      previousMeterReading: previousReadingSource ? previousReadingSource.currentMeterReading : ""
    }));
  }, [previousReadingSource]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.post("/admin/electricity", { ...form, roomId: selectedRoomId });
      setMessage(`Electricity reading saved for room ${selectedRoom?.roomNumber}`);
      setForm((prev) => ({ ...prev, previousMeterReading: prev.currentMeterReading, currentMeterReading: "" }));
      loadRecords();
    } catch (err) {
      setError(err.response?.data?.message || "Electricity save failed");
    }
  };

  return (
    <>
      <div className="page-title">
        <div>
          <h2>Electricity</h2>
          <p>Select a room, save the monthly meter reading, and review previous electricity bills.</p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
        <section className="panel">
          <h3 className="mb-3 text-lg font-black">Rooms</h3>
          <div className="grid gap-2">
            {rooms.map((room) => (
              <button
                key={room._id}
                type="button"
                className={`flex items-center justify-between rounded-lg border p-3 text-left ${selectedRoomId === room._id ? "border-leaf bg-mint" : "border-[#dfe8e2] bg-white"}`}
                onClick={() => setSelectedRoomId(room._id)}
              >
                <span className="font-black">{room.roomNumber}</span>
                <span className="text-sm text-slate-600">{room.status}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="grid gap-5">
          {selectedRoom && (
            <section className="panel">
              <div className="mb-4 flex items-center gap-3">
                <div className="stat-icon tone-leaf"><Building2 size={20} /></div>
                <div>
                  <h3 className="text-xl font-black">Room {selectedRoom.roomNumber}</h3>
                  <p className="text-sm text-slate-600">{selectedRoom.roomType} · Rent {money(selectedRoom.monthlyRent)}</p>
                </div>
              </div>
              <form className="form-grid" onSubmit={submit}>
                {error && <div className="error full">{error}</div>}
                {message && <div className="success full">{message}</div>}
                <label className="field"><span>Month</span><select className="input" value={form.month} onChange={(e) => set("month", e.target.value)} required>{monthOptions.map((month) => <option key={month.value} value={month.value}>{month.label}</option>)}</select></label>
                <label className="field"><span>Year</span><input className="input" type="number" value={form.year} onChange={(e) => set("year", e.target.value)} required /></label>
                <label className="field">
                  <span>Previous Meter Reading</span>
                  <input
                    className="input"
                    type="number"
                    value={form.previousMeterReading}
                    onChange={(e) => set("previousMeterReading", e.target.value)}
                    placeholder="Auto from previous month"
                    readOnly={Boolean(previousReadingSource)}
                    required
                  />
                </label>
                <label className="field"><span>Current Meter Reading</span><input className="input" type="number" value={form.currentMeterReading} onChange={(e) => set("currentMeterReading", e.target.value)} required /></label>
                <label className="field"><span>Unit Price</span><input className="input" type="number" value={form.unitPrice} onChange={(e) => set("unitPrice", e.target.value)} required /></label>
                <div className="field"><span>Calculated Units</span><div className="input bg-[#f7faf6]">{calculatedUnits > 0 ? calculatedUnits : 0}</div></div>
                <div className="field full"><button className="btn"><Save size={18} />Save Reading</button></div>
              </form>
            </section>
          )}

          <section className="panel">
            <h3 className="mb-3 text-lg font-black">Previous Electricity Bills</h3>
            <div className="table-wrap">
              <table className="data-table mobile-cards">
                <thead><tr><th>Month</th><th>Year</th><th>Previous</th><th>Current</th><th>Units</th><th>Unit Price</th><th>Electricity Bill</th></tr></thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r._id}>
                      <td data-label="Month">{monthLabel(r.month)}</td><td data-label="Year">{r.year}</td><td data-label="Previous">{r.previousMeterReading}</td><td data-label="Current">{r.currentMeterReading}</td><td data-label="Units">{r.usedUnits}</td><td data-label="Unit Price">{money(r.unitPrice)}</td><td data-label="Electricity Bill">{money(r.electricityBill)}</td>
                    </tr>
                  ))}
                  {!records.length && <tr><td colSpan="7">No electricity records for this room yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Electricity;
