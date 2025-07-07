import React, { useState } from "react";
import Header from "../Header/Header";
import "./Profile.css";

const Profile = () => {
  const storedUser =
    JSON.parse(localStorage.getItem("user-info")) ||
    JSON.parse(sessionStorage.getItem("user-info")) ||
    null;

  const [user, setUser] = useState(storedUser);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    phone: user?.phone || "",
  });

  if (!user) {
    return (
      <div>
        <Header />
        <div
          className="container"
          style={{ marginTop: 40, textAlign: "center" }}
        >
          <h2>Bạn chưa đăng nhập!</h2>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...form };
    setUser(updatedUser);
    setEdit(false);
    // Lưu lại vào localStorage/sessionStorage
    if (localStorage.getItem("user-info")) {
      localStorage.setItem("user-info", JSON.stringify(updatedUser));
    } else {
      sessionStorage.setItem("user-info", JSON.stringify(updatedUser));
    }
    alert("Cập nhật thông tin thành công!");
  };

  return (
    <div>
      <Header />
      <div className="profile-page">
        <div className="profile-container">
          <h2 className="profile-title">Thông tin tài khoản</h2>
          <div className="profile-info">
            {edit ? (
              <>
                <div>
                  <span className="profile-label">Username:</span>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    disabled
                  />
                </div>
                <div>
                  <span className="profile-label">Email:</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <span className="profile-label">Name:</span>
                  <input
                    type="text"
                    name="firstname"
                    value={form.firstname}
                    onChange={handleChange}
                    placeholder="First name"
                  />
                  <input
                    type="text"
                    name="lastname"
                    value={form.lastname}
                    onChange={handleChange}
                    placeholder="Last name"
                  />
                </div>
                <div>
                  <span className="profile-label">Phone:</span>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="profile-label">Username:</span>{" "}
                  {user.username}
                </div>
                <div>
                  <span className="profile-label">Email:</span> {user.email}
                </div>
                <div>
                  <span className="profile-label">Name:</span> {user.firstname}{" "}
                  {user.lastname}
                </div>
                <div>
                  <span className="profile-label">Phone:</span> {user.phone}
                </div>
              </>
            )}
          </div>
          {edit ? (
            <div>
              <button className="profile-btn" onClick={handleSave}>
                Lưu thay đổi
              </button>
              <button
                className="profile-btn"
                style={{ background: "#ccc", color: "#222", marginTop: 8 }}
                onClick={() => setEdit(false)}
              >
                Hủy
              </button>
            </div>
          ) : (
            <button className="profile-btn" onClick={() => setEdit(true)}>
              Chỉnh sửa thông tin
            </button>
          )}
          <button
            className="profile-btn"
            style={{ marginTop: 16 }}
            onClick={() => (window.location.href = "/changepassword")}
          >
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
