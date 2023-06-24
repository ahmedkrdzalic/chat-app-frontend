import React, { useContext, useEffect, useState } from "react";
import { socket } from "../socket";
import { LoginContext } from "../contexts/LoginContext";
import ScrollToBottom from "react-scroll-to-bottom";
import moment from "moment";
import axios from "axios";

function Room({ room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const { user } = useContext(LoginContext);

  useEffect(() => {
    //fetch recent messages from the room
    axios
      .get(process.env.REACT_APP_BACKEND_URL + `/messages/room/${room._id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.data) {
          setMessageList(response.data);
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, [room]);

  const sendMessage = async () => {
    if (currentMessage.trim() !== "") {
      const messageData = {
        room: { _id: room._id, name: room.name },
        author: { _id: user._id, email: user.email },
        message: currentMessage,
        time: new Date(Date.now()),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [messageData, ...list]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    //join room
    socket.emit("join_room", room?._id);
  }, [room]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      //   console.log(data);
      setMessageList((list) => [data, ...list]);
    });
  }, [socket]);

  return (
    <div className="dashboard-chat">
      <div className="room-info">
        <div className="room-info-name">
          Room: <span>{room?.name}</span>
        </div>
        <div className="room-info-id">_id: {room?._id}</div>
        <hr />
      </div>

      <div className="chat-body">
        <ScrollToBottom className="messages-container">
          {messageList.toReversed().map((messageContent) => {
            return (
              <div
                className={`message ${
                  user.email === messageContent.author.email ? "me" : "stranger"
                }`}
              >
                <div>
                  <div className="message-content">
                    {messageContent.message}
                  </div>
                  <div className="message-meta">
                    <div id="author">{messageContent.author.email}</div>
                    <div id="time">
                      {moment(messageContent.time).format(
                        "DD:MM:YYYY HH:mm:ss"
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Room;
