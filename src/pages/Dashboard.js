import React, { useEffect, useState } from "react";
import Room from "../components/Room";
import axios from "axios";
import { socket } from "../socket";

function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [createRoomName, setCreateRoomName] = useState("");

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

  const createRoom = (name) => {
    if (!name || name.trim() === "") {
      return;
    }
    let url = process.env.REACT_APP_BACKEND_URL + `/rooms`;
    axios
      .post(
        url,
        {
          name,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data) {
          setRooms([...rooms, response.data]);
        }
      })
      .catch((error) => {
        console.log(error.response.error || error.message);
        alert(error.response.error || error.message);
      });
  };

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
                <button
                  className="join-room-button"
                  onClick={() => {
                    //leave room or leave a chat with user
                    socket.emit("leave_room", room?._id);
                    //set room private chat with user
                    setRoom({ _id: u?._id, name: u?.email });
                  }}
                >
                  Chat
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="rooms-container">
          <div className="rooms">
            <div className="title">Rooms</div>
          </div>
          <div className="create-room-container">
            <input
              className="create-room-input"
              placeholder="Room name"
              onChange={(e) => setCreateRoomName(e.target.value)}
            />
            <button
              className="create-room-button"
              onClick={() => {
                createRoom(createRoomName);
              }}
            >
              Create
            </button>
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
