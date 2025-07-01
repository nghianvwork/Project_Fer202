import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  // Check user login
  const user = JSON.parse(localStorage.getItem("user-info") || sessionStorage.getItem("user-info") || "null");

  const handleLogin = () => navigate("/login");
  const handleLogout = () => {
    localStorage.removeItem("user-info");
    sessionStorage.removeItem("user-info");
    navigate("/login");
  };
  const handleSignup = () => navigate("/signup");
  const handleChangePassword = () => navigate("/changepassword");

  return (
    <header className="cinema-header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            <img
              src="/Logo_cinema.jpg"
              alt="Galaxy Cinema"
            />
          </div>

          {/* Main Nav */}
          <nav className="main-nav">
            <a className="nav-link" onClick={() => navigate("/")}>Lịch chiếu</a>
            <a className="nav-link" onClick={() => navigate("/")}>Rạp chiếu</a>
            <a className="nav-link" onClick={() => navigate("/")}>Phim chiếu</a>
            <a className="nav-link" onClick={() => navigate("/")}>Review phim</a>
            <a className="nav-link" onClick={() => navigate("/topfilm")}>Top phim</a>
            <a className="nav-link" onClick={() => navigate("/")}>Blog phim</a>
          </nav>

          {/* Header Actions */}
          <div className="header-actions">
            <button className="search-btn" title="Tìm kiếm"><span role="img" aria-label="search">🔍</span></button>
            {!user ? (
              <>
                <button className="login-btn" onClick={handleLogin}>Đăng Nhập</button>
                <button className="login-btn" onClick={handleSignup}>Đăng Ký</button>
              </>
            ) : (
              <>
                <button className="login-btn" onClick={handleChangePassword}>Đổi MK</button>
                <button className="login-btn" onClick={handleLogout}>Đăng Xuất</button>
                <div className="member-badge">G STAR</div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
