
import React, { useState } from "react";
import Message from "./Message";
import ChatInput from "./ChatInput";
import { sendMessageToAI } from "../../services/aiService";
import "./styles.css";

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "🎬 Hi! I can help you find movies or book tickets." }
  ]);

  const handleSend = async (userMessage) => {
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    const aiResponse = await sendMessageToAI(userMessage);
    setMessages((prev) => [...prev, { sender: "bot", text: aiResponse }]);
  };

  return (
    <div className="chat-window">
      <div className="chat-body">
        {messages.map((msg, i) => (
          <Message key={i} sender={msg.sender} text={msg.text} />
        ))}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}
