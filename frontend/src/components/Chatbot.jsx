import React, { useState, useEffect, useRef } from "react";
import { sendChatMessage } from "../api/client";

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
    setMessages((msgs) => [
      ...msgs,
      { id: crypto.randomUUID(), role: "user", content: input },
    ]);
    try {
      const res = await sendChatMessage(input);
      setMessages((msgs) => [
        ...msgs,
        { id: crypto.randomUUID(), role: "ai", content: res.data.answer },
      ]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        {
          id: crypto.randomUUID(),
          role: "ai",
          content: "An error occurred while communicating with the AI.",
        },
      ]);
    }
    setInput("");
    setLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chatbotMessages");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-modern-container">
      <div className="chatbot-modern-header">
        <h2 className="chatbot-modern-title">Chatbot AI</h2>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            disabled={loading}
            className="chatbot-modern-clear"
          >
            Clear
          </button>
        )}
      </div>
      <div className="chatbot-modern-messages">
        {messages.length === 0 && (
          <div className="chatbot-modern-placeholder">
            Ask a question about cryptocurrencies…
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
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
