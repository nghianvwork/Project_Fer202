import React from "react";
import { useNavigate } from "react-router-dom";
import { Film, Home, LogOut, User } from "lucide-react";

const AdminHeader = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user-info") || sessionStorage.getItem("user-info") || "null");

  const handleLogout = () => {
    localStorage.removeItem("user-info");
    sessionStorage.removeItem("user-info");
    navigate("/login");
  };

  return (
    <header style={{
      background: "linear-gradient(90deg, #764ba2 0%, #667eea 100%)",
      color: "#fff",
      padding: "0",
      marginBottom: 24,
      boxShadow: "0 4px 24px #c3b7e955",
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        padding: "0 32px"
      }}>
        {/* Logo + Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }} onClick={() => navigate("/admin")}>
          <Film size={32} />
          <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: 1 }}>Admin Cinema</span>
        </div>
        {/* Menu admin */}
        <nav style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span style={adminNavStyle} onClick={() => navigate("/admin")}>Dashboard</span>
          <span style={adminNavStyle} onClick={() => navigate("/home")}><Home size={18} style={{ marginBottom: -3 }} /> Trang user</span>
        </nav>
        {/* User actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontWeight: 500 }}>
            <User size={18} /> {user?.firstname || user?.username || "Admin"}
          </span>
          <span style={{
            ...adminNavStyle,
            background: "#fff2",
            padding: "6px 12px",
            borderRadius: 8,
            cursor: "pointer"
          }} onClick={handleLogout}>
            <LogOut size={16} style={{ marginBottom: -2, marginRight: 3 }} />
            Đăng xuất
          </span>
        </div>
      </div>
    </header>
  );
};

const adminNavStyle = {
  fontWeight: 500,
  fontSize: 15,
  cursor: "pointer",
  padding: "4px 8px",
  borderRadius: 8,
  transition: "background 0.2s",
  userSelect: "none"
};

export default AdminHeader;
