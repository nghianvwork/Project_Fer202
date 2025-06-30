import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRole = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user-info') || sessionStorage.getItem('user-info') || 'null');
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRole;