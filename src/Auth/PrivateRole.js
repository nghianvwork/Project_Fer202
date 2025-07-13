import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRole = ({ children, adminOnly }) => {
  const user = JSON.parse(localStorage.getItem('user-info') || sessionStorage.getItem('user-info') || 'null');

  // Nếu chưa đăng nhập
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu là trang chỉ dành cho admin mà user không phải admin
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  // Nếu user hợp lệ (và role phù hợp nếu là trang admin)
  return children;
};

export default PrivateRole;