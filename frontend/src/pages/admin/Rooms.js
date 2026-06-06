import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import api from "../../api/axios";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [editing, setEditing] = useState(null);

  const load = () => api.get("/admin/rooms", { params: { search, status } }).then((res) => setRooms(res.data));
  useEffect(() => { load(); }, [status]);

  const save = async () => {
    await api.put(`/admin/rooms/${editing._id}`, editing);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this room?")) return;
    await api.delete(`/admin/rooms/${id}`);
    load();
  };

  return (
    <>
      <div className="page-title">
        <div><h2>Rooms</h2><p>Search, edit, and manage room occupancy.</p></div>
        <Link className="btn" to="/admin/rooms/add"><Plus size={18} />Add Room</Link>
      </div>
      <section className="panel">
        <div className="mb-4 flex flex-wrap gap-2">
          <input className="input max-w-sm" placeholder="Search rooms" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn secondary" onClick={load}><Search size={18} />Search</button>
          <select className="input max-w-[190px]" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="All">All Rooms</option>
            <option value="Available">Available Rooms</option>
            <option value="Unavailable">Unavailable Rooms</option>
          </select>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Room</th><th>Monthly Rental</th><th>Description</th><th>Capacity</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id}>
                  <td>{editing?._id === room._id ? <input className="input" value={editing.roomNumber} onChange={(e) => setEditing({ ...editing, roomNumber: e.target.value })} /> : room.roomNumber}</td>
                  <td>{editing?._id === room._id ? <input className="input" type="number" value={editing.monthlyRent} onChange={(e) => setEditing({ ...editing, monthlyRent: e.target.value })} /> : money(room.monthlyRent)}</td>
                  <td>{editing?._id === room._id ? <input className="input" value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /> : room.description || "-"}</td>
                  <td>{editing?._id === room._id ? <input className="input" type="number" value={editing.maxBoarders} onChange={(e) => setEditing({ ...editing, maxBoarders: e.target.value })} /> : `${room.currentBoarders}/${room.maxBoarders}`}</td>
                  <td><span className="rounded-full bg-mint px-3 py-1 text-xs font-bold text-leaf">{room.status}</span></td>
                  <td>
                    {editing?._id === room._id ? (
                      <button className="btn" onClick={save}>Save</button>
                    ) : (
                      <div className="flex gap-2">
                        <button className="btn secondary" title="Edit room" onClick={() => setEditing(room)}><Pencil size={16} /></button>
                        <button className="btn danger" title="Delete room" onClick={() => remove(room._id)}><Trash2 size={16} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!rooms.length && <tr><td colSpan="6">No rooms found for this filter.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Rooms;
