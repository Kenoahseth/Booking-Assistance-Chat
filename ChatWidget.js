import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const fetchMessages = async () => {
    const res = await fetch("http://localhost:5000/api/chat");
    const data = await res.json();
    setMessages(data.messages);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, sender: "client" }),
    });

    setInput("");
    fetchMessages();
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mt-5">
      <div className="card chat-app">
        <div className="chat-history p-3 border rounded" style={{ height: "300px", overflowY: "scroll" }}>
          <ul className="list-unstyled">
            {messages.map((msg, index) => (
              <li key={index} className={`text-${msg.sender === "client" ? "right" : "left"}`}>
                <div className={`alert alert-${msg.sender === "client" ? "primary" : "secondary"} d-inline-block`}>
                  {msg.message}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="chat-message mt-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter text here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="input-group-append">
              <button className="btn btn-primary" onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
