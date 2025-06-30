import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Nav = () => {
  const navigate = useNavigate();
  // const user = JSON.parse(localStorage.getItem('user') || 'null');
  const handleLogin = () => {
    navigate("/login");
  };
  const handleSignUp = () => {
    navigate("/signup");
  };
  const handleChangePassword = () => {
    navigate("/changepassword");
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="d-flex align-items-center ">
        <button className="btn-login" onClick={handleLogin}>
          Login
        </button>
        <button className="btn-login" onClick={handleSignUp}>
          Sign Up
        </button>
        {/* {user && (
          <button className="btn-login" onClick={handleChangePassword}>
            Đổi mật khẩu
          </button>
        )} */}
        <button className="btn-login" onClick={handleChangePassword}>
          Đổi mật khẩu
        </button>
      </div>
    </nav>
  );
};
export default Nav;
