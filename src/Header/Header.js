import React from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "bootstrap";
import { useNavigate } from "react-router-dom";
const Nav  = () =>{
  const navigate = useNavigate();
  const handleLogin =()=>{
      navigate("/login")
  }
  const handleSignUp =() =>{
    navigate("/signup")
  }
    return(
        <nav className="navbar navbar-dark bg-dark">
            <div className="d-flex align-items-center ">
               <button className="btn-login" onClick={() => handleLogin()}>
                 Login
               </button>
               <button className="btn-login" onClick={() => handleSignUp()}>
                 Sign Up
               </button>

            </div>
            

        </nav>
    )
}
export default Nav;