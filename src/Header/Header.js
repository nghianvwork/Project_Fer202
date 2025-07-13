import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  // Check user login
  const user = JSON.parse(localStorage.getItem("user-info") || sessionStorage.getItem("user-info") || "null");

  const handleLogin = () => navigate("/login");
  const handleLogout = () => {
    localStorage.removeItem("user-info");
    sessionStorage.removeItem("user-info");
    navigate("/");
  };
  const handleSignup = () => navigate("/signup");
  const handleChangePassword = () => navigate("/changepassword");

  const [cinemas, setCinemas] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    fetch("http://localhost:9999/moviesData")
      .then((res) => res.json())
      .then((data) => {
        const cinemaSet = new Set();
        data.forEach(movie => {
          movie.showtimes?.forEach(show => {
            cinemaSet.add(show.cinema);
          });
        });
        setCinemas([...cinemaSet]);
      });
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

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
            <div
              className="nav-link dropdown-cinema"
              ref={dropdownRef}
              tabIndex={0}
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
              onClick={() => setShowDropdown(v => !v)}
              style={{ position: "relative", userSelect: "none", paddingBottom: 0, marginBottom: 0 }}
            >
              Rạp chiếu <span style={{ fontSize: 12, marginLeft: 4 }}>▼</span>
              <div
                className="dropdown-menu-cinema"
                style={{
                  display: showDropdown ? "block" : "none",
                  position: "absolute",
                  top: "calc(100% + 2px)", // Chỉ cách menu 2px!
                  left: 0,
                  background: "#fff",
                  minWidth: 220,
                  boxShadow: "0 8px 32px 0 rgba(31,38,135,0.18)",
                  borderRadius: 16,
                  zIndex: 20,
                  padding: "8px 0",
                  color: "#222",
                  fontSize: 16,
                  margin: 0
                }}
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                {cinemas.map((cinema) => (
                  <div
                    key={cinema}
                    className="dropdown-item-cinema"
                    style={{
                      padding: "12px 24px",
                      cursor: "pointer",
                      transition: "background 0.2s",
                      whiteSpace: "nowrap",
                      borderRadius: 8,
                      margin: "0 8px"
                    }}
                    onClick={() => {
                      setShowDropdown(false);
                      navigate(`/cinema/${cinema.replace(/\s+/g, "-").toLowerCase()}`);
                    }}
                  >
                    {cinema}
                  </div>
                ))}
              </div>
            </div>
            <a className="nav-link" onClick={() => navigate("/")}>Phim chiếu</a>
            <a className="nav-link" onClick={() => navigate("/")}>Review phim</a>
            <a className="nav-link" onClick={() => navigate("/topfilm")}>Top phim</a>
            <a className="nav-link" onClick={() => navigate("/offerlist")}>Ưu đãi</a>
            <button className="login-btn" onClick={() => navigate('/create-movie')}>
              Thêm phim
            </button>

          </nav>

          {/* Header Actions */}
          <div className="header-actions">
            <button className="search-btn" title="Tìm kiếm"><span role="img" aria-label="search">🔍</span></button>
            {!user ? (
              <>
             
                {/* <button className="login-btn" onClick={handleLogin}>Đăng Nhập</button>
                <button className="login-btn" onClick={handleSignup}>Đăng Ký</button> */}
              <div className="member-badge">
                <Link to={"/login"}>
                Đăng nhập
                </Link>
              </div>
              <div className="member-badge">
                <Link to={"/register"}>
                Đăng kí
                </Link>
              </div>
                
              </>
            ) : (
              <>
               
                <div className="member-badge">
                <Link to={"/login"}>
                Đăng xuất
                </Link>
              </div>
                <div className="member-badge">
                  <Link to={"/profile"}>
                    User
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
