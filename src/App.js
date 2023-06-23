import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { socket } from "./socket";
import axios from "axios";
import { LoginContext } from "./contexts/LoginContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { Registration } from "./pages/Registration";
import { Login } from "./pages/Login";
import MainMenu from "./components/MainMenu";
import "./App.css";

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [user, setUser] = useState(null);

  function connect() {
    socket.auth = { token: localStorage.getItem("token") };
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  useEffect(() => {
    if (user) {
      connect();
    } else {
      disconnect();
    }
  }, [user]);

  useEffect(() => {
    socket.on("error", (data) => {
      alert(data);
    });
  }, []);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    } else {
      axios
        .get(process.env.REACT_APP_BACKEND_URL + `/users/profile`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((response) => {
          if (response.data) {
            setUser(response.data.user);
            localStorage.setItem("user", JSON.stringify(response.data.user));
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  }, []);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div className="App">
      <LoginContext.Provider value={{ user, setUser }}>
        <Router>
          <MainMenu isConnected={isConnected} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </LoginContext.Provider>
    </div>
  );
}
