import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
   
    let user = { username, password, email };


    let response = await fetch("http://localhost:9999/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(user)
    });


    if (response.ok) {
      let result = await response.json();
    
      localStorage.setItem('user-info', JSON.stringify(result));
      
      navigate("/login");
    } else {
      alert("Đăng ký thất bại!");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 16 }}>
      <h2>Đăng ký tài khoản</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Tên đăng nhập:</label>
          <input
            className="form-control"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Mật khẩu:</label>
          <input
          className="form-control"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
          className="form-control"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Đăng ký</button>
      </form>
    </div>
  );
}

export default Register;
