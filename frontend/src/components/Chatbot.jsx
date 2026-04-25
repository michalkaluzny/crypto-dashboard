import React, { useState, useEffect, useRef } from "react";

import "../App.css";


function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatbotMessages");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("chatbotMessages", JSON.stringify(messages));
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setMessages((msgs) => [...msgs, { role: "user", content: input }]);
    try {
      const res = await fetch("http://localhost:8000/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      if (!res.ok) throw new Error("Serwer error");
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        { role: "ai", content: data.answer }
      ]);
    } catch (e) {
      setMessages((msgs) => [
        ...msgs,
        { role: "ai", content: "An error occurred while communicating with the AI." }
      ]);
    }
    setInput("");
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-modern-container">
      <h2 className="chatbot-modern-title">Chatbot AI</h2>
      <div className="chatbot-modern-messages">
        {messages.length === 0 && (
          <div className="chatbot-modern-placeholder">
            Ask a question about cryptocurrencies…
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chatbot-modern-row ${msg.role === "user" ? "user" : "ai"}`}
          >
            <div className="chatbot-modern-avatar">
              {msg.role === "user" ? (
                <span role="img" aria-label="user">🧑</span>
              ) : (
                <span role="img" aria-label="ai">🤖</span>
              )}
            </div>
            <div className="chatbot-modern-bubble">
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chatbot-modern-row ai">
            <div className="chatbot-modern-avatar">
              <span role="img" aria-label="ai">🤖</span>
            </div>
            <div className="chatbot-modern-bubble chatbot-modern-loading">
              <span className="chatbot-modern-spinner"></span>
              <span style={{ marginLeft: 10 }}>AI responds...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatbot-modern-input-row">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your message..."
          className="chatbot-modern-input"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="chatbot-modern-send"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
