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
    <>
      <header className="cinema-header">
        <div className="container-fluid">
          <div className="row align-items-center header-content">
            
            {/* Logo Section */}
            <div className="col-lg-3 col-md-12 col-sm-12">
              <div className="logo d-flex align-items-center justify-content-lg-start justify-content-center" onClick={() => navigate("/")}>
                <img src="/Logo_cinema.jpg" alt="Cinema" />
                
              </div>
            </div>

            {/* Main Navigation */}
            <div className="col-lg-6 col-md-12 col-sm-12">
              <nav className="main-nav">
                <a className="nav-link" onClick={() => navigate("/")}>
                  🎭 Lịch chiếu
                </a>
                
                <div
                  className="nav-link dropdown-cinema"
                  ref={dropdownRef}
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                  onClick={() => setShowDropdown(v => !v)}
                >
                  🏢 Rạp chiếu
                  <span className="dropdown-arrow">▼</span>
                  
                  {showDropdown && (
                    <div
                      className="dropdown-menu-cinema"
                      onMouseEnter={() => setShowDropdown(true)}
                      onMouseLeave={() => setShowDropdown(false)}
                    >
                      {cinemas.map((cinema) => (
                        <div
                          key={cinema}
                          className="dropdown-item-cinema"
                          onClick={() => {
                            setShowDropdown(false);
                            navigate(`/cinema/${cinema.replace(/\s+/g, "-").toLowerCase()}`);
                          }}
                        >
                          🎪 {cinema}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <a className="nav-link" onClick={() => navigate("/")}>
                  🎬 Phim chiếu
                </a>
                
                <a className="nav-link" onClick={() => navigate("/")}>
                  ⭐ Review
                </a>
                
                <a className="nav-link" onClick={() => navigate("/topfilm")}>
                  🏆 Top phim
                </a>
                
                <a className="nav-link d-none d-lg-block" onClick={() => navigate("/")}>
                  📝 Blog
                </a>
                
                <button 
                  className="add-movie-btn" 
                  onClick={() => navigate('/create-movie')}
                >
                  ➕ Thêm phim
                </button>
              </nav>
            </div>

            {/* Header Actions */}
            <div className="col-lg-3 col-md-12 col-sm-12">
              <div className="header-actions">
                <button className="search-btn" title="Tìm kiếm">
                  🔍
                </button>
                
                {!user ? (
                  <>
                    <div className="member-badge">
                      <Link to="/login">🔐 Đăng nhập</Link>
                    </div>
                    <div className="member-badge d-none d-sm-block">
                      <Link to="/register">📝 Đăng ký</Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="member-badge">
                      <Link to="/profile">👤 Profile</Link>
                    </div>
                    <div className="member-badge">
                      <Link to="/login" onClick={handleLogout}>🚪 Đăng xuất</Link>
                    </div>
                  </>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;