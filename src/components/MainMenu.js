import axios from "axios";
import React, { useContext } from "react";
import { LoginContext } from "../contexts/LoginContext";
import { Link, Navigate } from "react-router-dom";
import { ConnectionState } from "./ConnectionState";

function MainMenu({ isConnected }) {
  const { user, setUser } = useContext(LoginContext);

  const logout = () => {
    axios
      .get(process.env.BACKEND_URL + `/sign/logout`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        Navigate(`/`);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return (
    <div className="main-menu-container">
      <Link className="menu-item" to="/">
        Home
      </Link>

      {user ? (
        <>
          <Link className="menu-item" to="/dashboard">
            Dashboard
          </Link>
          <button onClick={logout} className="menu-item">
            Logout
          </button>
        </>
      ) : (
        <>
          <Link className="menu-item" to="/login">
            Login
          </Link>
          <Link className="menu-item" to="/registration">
            Register
          </Link>
        </>
      )}
      <ConnectionState className="menu-item" isConnected={isConnected} />
    </div>
  );
}

export default MainMenu;
