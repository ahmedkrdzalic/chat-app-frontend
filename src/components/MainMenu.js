import axios from "axios";
import React, { useContext } from "react";
import { LoginContext } from "../helpers/LoginContext";
import { Link, Navigate } from "react-router-dom";

function MainMenu() {
  const { user, setUser } = useContext(LoginContext);

  const logout = () => {
    axios
      .get(`http://localhost:4000/sign/logout`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        setUser(null);
        localStorage.removeItem("user");
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
