import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Home, Pencil, Plus, Search, Trash2 } from "lucide-react";
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
        <div>
          <h2 style={{ background: "linear-gradient(135deg, #6ba88f 0%, #507568 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Rooms</h2>
          <p>Manage room details, capacity, and occupancy status.</p>
        </div>
        <Link className="btn" to="/admin/rooms/add"><Plus size={18} />Add Room</Link>
      </div>

      <section className="panel">
        {/* Filter & Search Bar */}
        <div className="filter-bar mb-5">
          <input 
            className="input max-w-sm" 
            placeholder="Search by room number..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
          <button className="btn secondary" onClick={load}>
            <Search size={18} />Search
          </button>
          <select className="input max-w-[200px]" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="All">All Rooms</option>
            <option value="Available">Available</option>
            <option value="Unavailable">Occupied</option>
          </select>
        </div>

        {/* Rooms Table */}
        {rooms.length > 0 ? (
          <div className="table-wrap">
            <table className="data-table mobile-cards">
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Monthly Rent</th>
                  <th>Description</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room._id}>
                    <td className="font-semibold" data-label="Room">{editing?._id === room._id ? <input className="input" value={editing.roomNumber} onChange={(e) => setEditing({ ...editing, roomNumber: e.target.value })} /> : room.roomNumber}</td>
                    <td data-label="Monthly Rent">{editing?._id === room._id ? <input className="input" type="number" value={editing.monthlyRent} onChange={(e) => setEditing({ ...editing, monthlyRent: e.target.value })} /> : money(room.monthlyRent)}</td>
                    <td data-label="Description">{editing?._id === room._id ? <input className="input" value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /> : room.description || "-"}</td>
                    <td data-label="Capacity">{editing?._id === room._id ? <input className="input" type="number" value={editing.maxBoarders} onChange={(e) => setEditing({ ...editing, maxBoarders: e.target.value })} /> : `${room.currentBoarders}/${room.maxBoarders}`}</td>
                    <td data-label="Status"><span style={{ display: "inline-flex", borderRadius: "20px", paddingLeft: "12px", paddingRight: "12px", paddingTop: "6px", paddingBottom: "6px", fontSize: "13px", fontWeight: "900", background: room.status === 'Available' ? "linear-gradient(135deg, rgba(107, 168, 143, 0.15) 0%, rgba(90, 154, 126, 0.1) 100%)" : "linear-gradient(135deg, rgba(201, 169, 97, 0.15) 0%, rgba(172, 143, 74, 0.1) 100%)", color: room.status === 'Available' ? "#6ba88f" : "#c9a961", border: room.status === 'Available' ? "1px solid rgba(107, 168, 143, 0.25)" : "1px solid rgba(201, 169, 97, 0.25)" }}>{room.status}</span></td>
                    <td data-label="Actions">
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
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <Home size={68} />
            <strong>No Rooms Found</strong>
            <p>Start by creating your first room or adjust your search filters.</p>
          </div>
        )}
      </section>
    </>
  );
};

export default Rooms;
