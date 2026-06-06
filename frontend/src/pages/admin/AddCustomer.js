import { useEffect, useMemo, useState } from "react";
import { Plus, Save, X } from "lucide-react";
import api from "../../api/axios";

const blankForm = {
  name: "",
  address: "",
  email: "",
  phoneNumber: "",
  whatsappNumber: "",
  job: "",
  relationship: "",
  nicNumber: "",
  marriedStatus: "Single",
  roomFee: "",
  nicPhoto: null,
  marriageCertificate: null
};

const AddCustomer = () => {
  const [rooms, setRooms] = useState([]);
  const [roomBoarders, setRoomBoarders] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(blankForm);

  const selectedRoom = useMemo(() => rooms.find((room) => room._id === selectedRoomId), [rooms, selectedRoomId]);
  const roomIsFull = selectedRoom && roomBoarders.length >= selectedRoom.maxBoarders;

  const loadRooms = () => api.get("/admin/rooms").then((res) => setRooms(res.data));
  const loadRoomBoarders = (roomId) => {
    if (!roomId) return setRoomBoarders([]);
    return api.get("/admin/customers", { params: { roomId, status: "active" } }).then((res) => setRoomBoarders(res.data));
  };

  useEffect(() => { loadRooms(); }, []);
  useEffect(() => { loadRoomBoarders(selectedRoomId); }, [selectedRoomId]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const chooseRoom = (roomId) => {
    const room = rooms.find((item) => item._id === roomId);
    setSelectedRoomId(roomId);
    setShowForm(false);
    setError("");
    setMessage("");
    setForm({ ...blankForm, roomFee: room?.monthlyRent || "" });
  };

  const openForm = () => {
    if (!selectedRoomId) return setError("Please select a room first");
    if (roomIsFull) return setError("This room is already full");
    setError("");
    setMessage("");
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!selectedRoomId) return setError("Please select a room first");
    if (roomIsFull) return setError("This room is already full");

    try {
      const data = new FormData();
      Object.entries({ ...form, roomId: selectedRoomId }).forEach(([key, value]) => {
        if (value !== null) data.append(key, value);
      });
      await api.post("/admin/customers", data, { headers: { "Content-Type": "multipart/form-data" } });
      setMessage("Boarder added to room");
      setShowForm(false);
      setForm({ ...blankForm, roomFee: selectedRoom?.monthlyRent || "" });
      await loadRoomBoarders(selectedRoomId);
      await loadRooms();
    } catch (err) {
      setError(err.response?.data?.message || "Boarder registration failed");
    }
  };

  return (
    <>
      <div className="page-title">
        <div>
          <h2>Boarder Registration</h2>
          <p>Select a room, view its boarders, then add a boarder when needed.</p>
        </div>
      </div>

      <section className="panel mb-5">
        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}
        <div className="form-grid">
          <label className="field">
            <span>Room Number</span>
            <select className="input" value={selectedRoomId} onChange={(e) => chooseRoom(e.target.value)} required>
              <option value="">Select room first</option>
              {rooms.map((room) => <option key={room._id} value={room._id}>{room.roomNumber} - {room.status}</option>)}
            </select>
          </label>
          <div className="field">
            <span>Room Capacity</span>
            <div className="input bg-[#f7faf6]">{selectedRoom ? `${roomBoarders.length}/${selectedRoom.maxBoarders}` : "-"}</div>
          </div>
        </div>

        {selectedRoom && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#dfe8e2] bg-[#f7faf6] p-4">
            <div>
              <p className="font-black">Room {selectedRoom.roomNumber}</p>
              <p className="text-sm text-slate-600">Monthly rental: Rs. {Number(selectedRoom.monthlyRent || 0).toLocaleString()} · Capacity: {selectedRoom.maxBoarders}</p>
            </div>
            <button className="btn" type="button" onClick={openForm} disabled={roomIsFull}>
              <Plus size={18} />Add Boarder
            </button>
          </div>
        )}
      </section>

      {selectedRoom && (
        <section className="panel mb-5">
          <h3 className="mb-3 text-lg font-black">Boarders In This Room</h3>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>WhatsApp</th><th>NIC</th><th>Relationship</th><th>Job</th><th>Status</th></tr></thead>
              <tbody>
                {roomBoarders.map((boarder) => (
                  <tr key={boarder._id}>
                    <td>{boarder.name}</td>
                    <td>{boarder.email || boarder.userId?.username || "-"}</td>
                    <td>{boarder.phoneNumber}</td>
                    <td>{boarder.whatsappNumber || "-"}</td>
                    <td>{boarder.nicNumber}</td>
                    <td>{boarder.relationship || "-"}</td>
                    <td>{boarder.job || "-"}</td>
                    <td>{boarder.isActive ? "Active" : "Inactive"}</td>
                  </tr>
                ))}
                {!roomBoarders.length && <tr><td colSpan="8">No boarders registered in this room yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {showForm && (
        <form className="panel form-grid" onSubmit={submit}>
          <div className="field full flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black">Add Boarder To Room {selectedRoom?.roomNumber}</h3>
              <p className="text-sm text-slate-600">This boarder will be saved as a separate boarder record.</p>
            </div>
            <button className="btn secondary" type="button" title="Close form" onClick={() => setShowForm(false)}><X size={16} /></button>
          </div>
          <label className="field"><span>Name</span><input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} required /></label>
          <label className="field"><span>Email</span><input className="input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required /></label>
          <label className="field"><span>NIC Number</span><input className="input" value={form.nicNumber} onChange={(e) => set("nicNumber", e.target.value)} required /></label>
          <label className="field"><span>Phone Number</span><input className="input" value={form.phoneNumber} onChange={(e) => set("phoneNumber", e.target.value)} required /></label>
          <label className="field"><span>WhatsApp Number</span><input className="input" value={form.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value)} /></label>
          <label className="field"><span>Relationship</span><input className="input" value={form.relationship} onChange={(e) => set("relationship", e.target.value)} placeholder="Friend, sibling, spouse..." /></label>
          <label className="field"><span>Job</span><input className="input" value={form.job} onChange={(e) => set("job", e.target.value)} /></label>
          <label className="field"><span>Room Fee</span><input className="input" type="number" value={form.roomFee} onChange={(e) => set("roomFee", e.target.value)} required /></label>
          <label className="field"><span>Married Status</span><select className="input" value={form.marriedStatus} onChange={(e) => set("marriedStatus", e.target.value)}><option>Single</option><option>Married</option></select></label>
          <label className="field"><span>NIC Photo</span><input className="input" type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => set("nicPhoto", e.target.files[0])} required /></label>
          <label className="field"><span>Marriage Certificate</span><input className="input" type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => set("marriageCertificate", e.target.files[0])} required={form.marriedStatus === "Married"} /></label>
          <label className="field full"><span>Address</span><textarea className="input" value={form.address} onChange={(e) => set("address", e.target.value)} /></label>
          <div className="field full"><button className="btn"><Save size={18} />Save Boarder</button></div>
        </form>
      )}

      {!selectedRoom && <section className="panel text-slate-600">Select a room to view and add boarders.</section>}
    </>
  );
};

export default AddCustomer;
