import axios from "axios";
import React, { useContext } from "react";
import { LoginContext } from "../contexts/LoginContext";
import { Link, Navigate } from "react-router-dom";

function MainMenu() {
  const { user, setUser } = useContext(LoginContext);

  const logout = () => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL + `/sign/logout`, {
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
    <div>
      <Link className="" to="/">
        Home
      </Link>

      {user ? (
        <>
          <Link className="" to="/dashboard">
            Dashboard
          </Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link className="" to="/login">
            Login
          </Link>
          <Link className="" to="/registration">
            Register
          </Link>
        </>
      )}
    </div>
  );
}

export default MainMenu;
