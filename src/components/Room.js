import React, { useContext, useEffect, useState } from "react";
import { socket } from "../socket";
import { LoginContext } from "../contexts/LoginContext";
import ScrollToBottom from "react-scroll-to-bottom";

function Room({ room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const { user } = useContext(LoginContext);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room._id,
        author: user.email,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    //join room
    socket.emit("join_room", room?._id);
  }, []);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      //   console.log(data);
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div>
      <h3>Room: {room?.name}</h3>
      <p>{room?._id}</p>

      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={user.email === messageContent.author ? "me" : "stranger"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
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
