import { useEffect, useState } from "react";
import { KeyRound, Save } from "lucide-react";
import api from "../../api/axios";

const AdminProfile = () => {
  const [profile, setProfile] = useState({ name: "", username: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/auth/me").then((res) => {
      setProfile({ name: res.data.user.name || "", username: res.data.user.username || "" });
    });
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const { data } = await api.put("/admin/profile", profile);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...user, name: data.name, username: data.username }));
      setMessage("Profile updated");
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.put("/admin/profile/password", passwords);
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage("Password changed successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Password change failed");
    }
  };

  return (
    <>
      <div className="page-title">
        <div><h2>Admin Profile</h2><p>Update your admin profile and password.</p></div>
      </div>
      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}
      <form className="panel form-grid mb-5" onSubmit={saveProfile}>
        <label className="field"><span>Name</span><input className="input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required /></label>
        <label className="field"><span>Username</span><input className="input" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} required /></label>
        <div className="field full"><button className="btn"><Save size={18} />Save Profile</button></div>
      </form>
      <form className="panel form-grid" onSubmit={changePassword}>
        <div className="field full"><h3 className="flex items-center gap-2 text-lg font-black"><KeyRound size={18} />Change Password</h3></div>
        <label className="field"><span>Current Password</span><input className="input" type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required /></label>
        <label className="field"><span>New Password</span><input className="input" type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required /></label>
        <label className="field"><span>Confirm Password</span><input className="input" type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} required /></label>
        <div className="field full"><button className="btn"><KeyRound size={18} />Change Password</button></div>
      </form>
    </>
  );
};

export default AdminProfile;

