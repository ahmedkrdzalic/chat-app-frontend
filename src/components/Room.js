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
      .get(`http://localhost:4000/messages/room/${room._id}`, {
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
    <div>
      <h3>Room: {room?.name}</h3>
      <p>{room?._id}</p>

      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.toReversed().map((messageContent) => {
            return (
              <div
                className="message"
                id={
                  user.email === messageContent.author.email ? "me" : "stranger"
                }
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">
                      {moment(messageContent.time).format(
                        "DD:MM:YYYY HH:mm:ss"
                      )}
                    </p>
                    <p id="author">{messageContent.author.email}</p>
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
