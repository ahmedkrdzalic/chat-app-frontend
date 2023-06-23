import React, { useContext } from "react";
import { LoginContext } from "../contexts/LoginContext";

export function ConnectionState({ isConnected }) {
  const { user } = useContext(LoginContext);

  return (
    <div>
      {isConnected && (
        <div className="connection-container">
          {user && <div className="connection-name">{user.email}</div>}

          <div
            className={isConnected ? "connection-online" : "connection-offline"}
          ></div>
        </div>
      )}
    </div>
  );
}
