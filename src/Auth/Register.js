import React, { useState } from "react";
import { User, Lock, Mail, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Register.css"; // import file CSS mới

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let user = { username, password, email };

    let response = await fetch("http://localhost:9999/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(user),
    });

    setIsLoading(false);

    if (response.ok) {
      let result = await response.json();
      localStorage.setItem("user-info", JSON.stringify(result));
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } else {
      alert("Đăng ký thất bại!");
    }
  };

  return (
    <div className="register-container">
      <div className="register-background-pattern"></div>
      <div className="register-card">
        <div className="register-header">
          <div className="register-logo">
            <Film color="#fff" size={36} />
          </div>
          <h1 className="register-title">CinemaHub</h1>
          <p className="register-subtitle">Tạo tài khoản để đặt vé xem phim</p>
        </div>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Tên đăng nhập</label>
            <div className="input-wrapper">
              <div className="input-icon">
                <User size={20} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                className="form-input"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <div className="input-wrapper">
              <div className="input-icon">
                <Lock size={20} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="form-input"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrapper">
              <div className="input-icon">
                <Mail size={20} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email"
                className="form-input"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`register-button${isLoading ? " button-disabled" : ""}`}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Đang đăng ký...
              </>
            ) : (
              "Đăng ký"
            )}
          </button>
        </form>
        <div className="register-footer">
          <p className="footer-text">
            Đã có tài khoản?
            <a href="/login" className="register-link">
              Đăng nhập
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
