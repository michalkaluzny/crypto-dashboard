import React, { useState, useEffect } from "react";

function Chatbot() {
  const [input, setInput] = useState("");
  // Wczytaj wiadomości z localStorage przy pierwszym renderze
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatbotMessages");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  // Zapisuj wiadomości do localStorage po każdej zmianie
  useEffect(() => {
    localStorage.setItem("chatbotMessages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    // Dodaj wiadomość użytkownika
    setMessages((msgs) => [...msgs, { role: "user", content: input }]);
    try {
      const res = await fetch("http://localhost:8000/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      if (!res.ok) throw new Error("Błąd serwera");
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        { role: "ai", content: data.answer }
      ]);
    } catch (e) {
      setMessages((msgs) => [
        ...msgs,
        { role: "ai", content: "Wystąpił błąd podczas komunikacji z AI." }
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
    <div
      style={{
        maxWidth: 700,
        margin: "32px auto 0 auto",
        padding: 24,
        border: "2px solid #1976d2",
        borderRadius: 16,
        background: "#f7faff",
        boxShadow: "0 4px 24px 0 rgba(25, 118, 210, 0.08)",
        minHeight: 420,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch"
      }}
    >
      <h2 style={{
        color: "#1976d2",
        fontWeight: 700,
        fontSize: 28,
        marginBottom: 18,
        letterSpacing: 1
      }}>Chatbot AI</h2>
      <div
        style={{
          minHeight: 220,
          marginBottom: 18,
          overflowY: "auto",
          background: "#fff",
          border: "1.5px solid #e3eafc",
          borderRadius: 10,
          padding: 14,
          boxShadow: "0 2px 8px 0 rgba(25, 118, 210, 0.04)"
        }}
      >
        {messages.length === 0 && (
          <div style={{ color: "#90a4ae", fontStyle: "italic" }}>
            Zadaj pytanie dotyczące kryptowalut…
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              margin: "12px 0",
              display: "flex",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              alignItems: "flex-end"
            }}
          >
            <span
              style={{
                fontWeight: 600,
                color: msg.role === "user" ? "#1976d2" : "#009688",
                margin: msg.role === "user" ? "0 0 0 8px" : "0 8px 0 0",
                fontSize: 15
              }}
            >
              {msg.role === "user" ? "Ty" : "AI"}:
            </span>
            <span
              style={{
                background: msg.role === "user" ? "#e3eafc" : "#e0f7fa",
                color: "#222",
                borderRadius: 8,
                padding: "8px 14px",
                maxWidth: 420,
                wordBreak: "break-word",
                fontSize: 16,
                boxShadow: msg.role === "user"
                  ? "0 1px 4px 0 rgba(25, 118, 210, 0.06)"
                  : "0 1px 4px 0 rgba(0, 150, 136, 0.06)"
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Wpisz wiadomość..."
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: 8,
            border: "1.5px solid #b6c7e3",
            fontSize: 16,
            outline: "none",
            background: "#fafdff"
          }}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: "12px 28px",
            borderRadius: 8,
            background: loading || !input.trim() ? "#b6c7e3" : "#1976d2",
            color: "#fff",
            border: "none",
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: 1,
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            transition: "background 0.2s"
          }}
        >
          Wyślij
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
