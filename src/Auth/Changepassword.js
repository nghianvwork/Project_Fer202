import React, { useState } from 'react';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const getCurrentUser = () => {
    let user = localStorage.getItem('user-info') || sessionStorage.getItem('user-info');
    return user ? JSON.parse(user) : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) {
      setMessage('Bạn chưa đăng nhập!');
      return;
    }
    if (oldPassword !== user.password) {
      setMessage('Mật khẩu cũ không đúng!');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('Mật khẩu mới không khớp!');
      return;
    }
    if (newPassword.length < 6) {
      setMessage('Mật khẩu mới phải từ 6 ký tự trở lên!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:9999/users/${user.id}`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword })
      });

      if (response.ok) {
        const updatedUser = { ...user, password: newPassword };
        if (localStorage.getItem('user-info')) {
          localStorage.setItem('user-info', JSON.stringify(updatedUser));
        } else if (sessionStorage.getItem('user-info')) {
          sessionStorage.setItem('user-info', JSON.stringify(updatedUser));
        }
        setMessage('Đổi mật khẩu thành công!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage('Có lỗi khi cập nhật mật khẩu trên server!');
      }
    } catch (err) {
      setMessage('Lỗi kết nối server!');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <h2>Đổi mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Mật khẩu cũ:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mật khẩu mới:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Nhập lại mật khẩu mới:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Đổi mật khẩu</button>
      </form>
      {message && <p style={{ color: message.includes('thành công') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
};

export default ChangePassword;
