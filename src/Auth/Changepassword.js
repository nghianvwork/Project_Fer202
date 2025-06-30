import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentUser = () => {
    let user = localStorage.getItem('user-info') || sessionStorage.getItem('user-info');
    return user ? JSON.parse(user) : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const user = getCurrentUser();
    if (!user) {
      setMessage('Bạn chưa đăng nhập!');
      setIsLoading(false);
      return;
    }
    if (oldPassword !== user.password) {
      setMessage('Mật khẩu cũ không đúng!');
      setIsLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('Mật khẩu mới không khớp!');
      setIsLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setMessage('Mật khẩu mới phải từ 6 ký tự trở lên!');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:9999/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword })
      });

      if (response.ok) {
        
      } else {
        setMessage('Có lỗi khi cập nhật mật khẩu trên server!');
        setIsLoading(false);
        return;
      }
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
      setIsLoading(false);
    } catch (err) {
      setMessage('Lỗi kết nối server!');
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f5ff 0%, #fff 60%, #e9e4fc 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 8px'
    }}>
      <div style={{
        maxWidth: 420,
        width: '100%',
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 6px 32px #d3e0ff55',
        margin: 'auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center', margin: '32px 0 16px'
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 64, height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(90deg,#498af5 0%,#ad56f7 100%)',
            marginBottom: 16
          }}>
            <Shield size={36} color="#fff" />
          </div>
          <h1 style={{ fontWeight: 700, fontSize: 32, margin: '0 0 8px', letterSpacing: 0 }}>Đổi Mật Khẩu</h1>
          <div style={{ color: '#888', fontSize: 16 }}>Bảo mật tài khoản của bạn</div>
        </div>
        {/* Form */}
        <form style={{ padding: 28, paddingTop: 0 }} onSubmit={handleSubmit} autoComplete="off">
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Mật khẩu cũ</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid #e3e8f0',
                  borderRadius: 12,
                  padding: '12px 44px 12px 16px',
                  fontSize: 16
                }}
                placeholder="Nhập mật khẩu hiện tại"
                required
              />
              <button type="button" style={{
                position: 'absolute', right: 10, top: 0, bottom: 0,
                background: 'none', border: 'none', cursor: 'pointer', color: '#999'
              }}
                tabIndex={-1}
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Mật khẩu mới</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid #e3e8f0',
                  borderRadius: 12,
                  padding: '12px 44px 12px 16px',
                  fontSize: 16
                }}
                placeholder="Nhập mật khẩu mới"
                required
              />
              <button type="button" style={{
                position: 'absolute', right: 10, top: 0, bottom: 0,
                background: 'none', border: 'none', cursor: 'pointer', color: '#999'
              }}
                tabIndex={-1}
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div style={{ marginBottom: 32 }}>
            <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Nhập lại mật khẩu mới</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid #e3e8f0',
                  borderRadius: 12,
                  padding: '12px 44px 12px 16px',
                  fontSize: 16
                }}
                placeholder="Nhập lại mật khẩu mới"
                required
              />
              <button type="button" style={{
                position: 'absolute', right: 10, top: 0, bottom: 0,
                background: 'none', border: 'none', cursor: 'pointer', color: '#999'
              }}
                tabIndex={-1}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || !oldPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            style={{
              width: '100%',
              padding: '12px 0',
              background: 'linear-gradient(90deg, #498af5 0%, #ad56f7 100%)',
              border: 'none',
              borderRadius: 12,
              fontSize: 18,
              color: '#fff',
              fontWeight: 600,
              marginBottom: 10,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              boxShadow: '0 4px 16px #c7b5ee22'
            }}
          >
            {isLoading ? 'Đang xử lý...' : (
              <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8}}>
                <Shield size={20} />
                Đổi mật khẩu
              </span>
            )}
          </button>
          {message && (
            <div style={{
              color: message.includes('thành công') ? '#09843f' : '#d82329',
              background: message.includes('thành công') ? '#f2fbf6' : '#fff6f6',
              border: `1px solid ${message.includes('thành công') ? '#b4f3d2' : '#ffd7da'}`,
              borderRadius: 8,
              padding: '12px 18px',
              marginTop: 8,
              textAlign: 'center',
              fontWeight: 500
            }}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
