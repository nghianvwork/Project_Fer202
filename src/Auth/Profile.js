import React from "react";
import Header from "../Header/Header";
import "./Profile.css"
const Profile = () => {
  // Lấy thông tin user từ localStorage hoặc sessionStorage
  const user =
    JSON.parse(localStorage.getItem("user-info")) ||
    JSON.parse(sessionStorage.getItem("user-info")) ||
    null;

  if (!user) {
    return (
      <div>
        <Header />
        <div className="container" style={{ marginTop: 40, textAlign: "center" }}>
          <h2>Bạn chưa đăng nhập!</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
        <Header />
        <div className="profile-page">
    
    <div className="profile-container">
      <h2 className="profile-title">Thông tin tài khoản</h2>
      <div className="profile-info">
        <div><span className="profile-label">Username:</span> {user.username}</div>
        <div><span className="profile-label">Email:</span> {user.email}</div>
        <div><span className="profile-label">Name:</span> {user.firstname} {user.lastname}</div>
        <div><span className="profile-label">Phone:</span> {user.phone}</div>
      </div>
      <button className="profile-btn" onClick={() => window.location.href = "/changepassword"}>
        Đổi mật khẩu
      </button>
    </div>
  </div>
    </div>
   
  );
};

export default Profile;