
import React, { useState } from "react";

export default function ChatInput({ onSend }) {
  const [message, setMessage] = useState("");

  const send = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        value={message}
        placeholder="Ask me anything..."
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
      />
      <button onClick={send}>Send</button>
    </div>
  );
}
