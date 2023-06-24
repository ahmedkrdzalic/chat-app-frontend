import React, { useEffect, useState } from "react";
import Room from "../components/Room";
import axios from "axios";
import { socket } from "../socket";

function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

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
      setOnlineUsers(data);
    });
  }, [socket]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-info">
        <div className="online-users-container">
          <div className="online-users">
            <div className="title">Online Users</div>
            <div className="connection-online"></div>
          </div>
          <div className="online-users-list">
            {onlineUsers.map((u) => (
              <div key={u?._id}>
                <p>{u?.email}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rooms-container">
          <div className="rooms">
            <div className="title">Rooms</div>
          </div>
          <div className="rooms-list">
            {rooms.map((r) => (
              <div className="room" key={r?._id}>
                <div className="rooms-name">{r?.name}</div>
                <button
                  className="join-room-button"
                  onClick={() => {
                    socket.emit("leave_room", room?._id);
                    setRoom(r);
                  }}
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {room && <Room room={room} />}
    </div>
  );
}

export default Dashboard;
