
import React from "react";
import "./styles.css";

export default function Message({ sender, text }) {
  return (
    <div className={`message ${sender === "user" ? "user" : "bot"}`}>
      <div className="bubble">{text}</div>
    </div>
  );
}
