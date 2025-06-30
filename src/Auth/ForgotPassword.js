import React, { useState } from "react";
import axios from "axios";
import "./ForgotPassword.css"; // Tạo file này để custom thêm
import 'bootstrap/dist/css/bootstrap.min.css';


function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập mật khẩu mới
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [type, setType] = useState("info"); // Kiểu alert

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `http://localhost:9999/users?email=${email}`
      );
      if (res.data.length === 0) {
        setMessage("Email không tồn tại trong hệ thống!");
        setType("danger");
      } else {
        setUserId(res.data[0].id);
        setMessage("Email hợp lệ! Nhập mật khẩu mới.");
        setType("success");
        setStep(2);
      }
    } catch (error) {
      setMessage("Lỗi hệ thống!");
      setType("danger");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:9999/users/${userId}`, {
        password: newPassword,
      });
      setMessage("Đổi mật khẩu thành công! Hãy đăng nhập lại.");
      setType("success");
      setStep(1);
      setEmail("");
      setNewPassword("");
    } catch (error) {
      setMessage("Lỗi khi cập nhật mật khẩu!");
      setType("danger");
    }
  };

  return (
    <div className="container forgot-bg d-flex align-items-center justify-content-center min-vh-100 min-vw-100">
      <div className="card p-4 shadow rounded-4" style={{ maxWidth: 400, width: "100%" }}>
        <h2 className="text-center mb-4 fw-bold text-primary">Quên mật khẩu</h2>
        {message && (
          <div className={`alert alert-${type} text-center`} role="alert">
            {message}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">Email đã đăng ký</label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 shadow-sm fw-semibold">
              Xác nhận
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label fw-semibold">Mật khẩu mới</label>
              <input
                id="newPassword"
                type="password"
                className="form-control"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <button type="submit" className="btn btn-success w-100 shadow-sm fw-semibold">
              Đổi mật khẩu
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;