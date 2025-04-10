import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
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
      body: JSON.stringify({ message: input, sender: "client" })
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
    <div className="container py-5">
      <div className="row d-flex justify-content-center">
        <div className="col-md-8 col-lg-6 col-xl-4">
          <div className="card" id="chat1" style={{ borderRadius: "15px" }}>
            <div className="card-header d-flex justify-content-between align-items-center p-3 bg-info text-white border-bottom-0"
              style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}>
              <i className="fas fa-angle-left"></i>
              <p className="mb-0 fw-bold">Live Chat</p>
              <i className="fas fa-times"></i>
            </div>
            <div className="card-body">
              {messages.map((msg, index) => (
                <div key={index} className="d-flex flex-row justify-content-start mb-4">
                  <div>
                    <p className={`small p-2 ms-3 mb-1 rounded ${msg.sender === "client" ? "bg-primary text-white" : "bg-light"}`}>{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
              <input type="text" className="form-control form-control-lg" id="exampleFormControlInput1"
                placeholder="Type message" value={input} onChange={(e) => setInput(e.target.value)} />
              <a className="ms-3" href="#!" onClick={sendMessage}><i className="fas fa-paper-plane"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
