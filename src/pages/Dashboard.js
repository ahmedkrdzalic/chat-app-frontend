import React, { useEffect, useState } from "react";
import Room from "../components/Room";
import axios from "axios";
import { socket } from "../socket";

function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState(null);

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

  return (
    <div>
      <h1>Dashboard</h1>
      <h3>Rooms</h3>
      <ul>
        {rooms.map((r) => (
          <li key={r?._id}>
            <p>{r?.name}</p>
            <button
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
      {room && <Room room={room} />}
    </div>
  );
}

export default Dashboard;
