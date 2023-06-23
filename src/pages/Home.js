import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LoginContext } from "../contexts/LoginContext";

function Home() {
  const { user } = useContext(LoginContext);

  return (
    <div className="home">
      <h1 className="home-title">Welcome to the Chat App</h1>
      {!user && (
        <h4 className="">
          <Link to="/login">Login</Link>/
          <Link to="/registration">Register</Link> to begin chatting!
        </h4>
      )}
    </div>
  );
}

export default Home;
