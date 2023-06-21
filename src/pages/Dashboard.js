import React, { useEffect, useState } from "react";
import Room from "../components/Room";
import axios from "axios";
import { socket } from "../socket";

function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  console.log(process.env.REACT_APP_BACKEND_URL);

  //fetch all public rooms
  useEffect(() => {
    let url = process.env.REACT_APP_BACKEND_URL + `/rooms`;
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.data) {
          setRooms(response.data);
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, []);

  useEffect(() => {
    socket.on("get-users", (data) => {
      console.log(data);
      setOnlineUsers(data);
    });
  }, [socket]);

  return (
    <div className="main-container">
      <div className="online-users-container">
        <h2 className="title">Online Users</h2>
        <ul className="online-users-list">
          {onlineUsers.map((u) => (
            <li key={u?._id}>
              <p>{u?.email}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="rooms-container">
        <h2 className="title">Rooms</h2>
        <ul className="rooms-list">
          {rooms.map((r) => (
            <li key={r?._id}>
              <p className="rooms-list-name">{r?.name}</p>
              <button
                className="join-room-button"
                onClick={() => {
                  socket.emit("leave_room", room?._id);
                  setRoom(r);
                }}
              >
                Join
              </button>
            </li>
          ))}
        </ul>
      </div>
      {room && <Room room={room} />}
    </div>
  );
}

export default Dashboard;
