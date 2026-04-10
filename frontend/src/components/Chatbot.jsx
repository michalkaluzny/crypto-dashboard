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
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 16, border: "1px solid #ddd", borderRadius: 8, background: "#fafcff" }}>
      <h2>Chatbot AI</h2>
      <div style={{ minHeight: 180, marginBottom: 12, overflowY: "auto", background: "#fff", border: "1px solid #eee", borderRadius: 4, padding: 8 }}>
        {messages.length === 0 && <div style={{ color: "#888" }}>Zadaj pytanie dotyczące kryptowalut…</div>}
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.role === "user" ? "right" : "left", margin: "8px 0" }}>
            <span style={{ fontWeight: "bold", color: msg.role === "user" ? "#1976d2" : "#009688" }}>
              {msg.role === "user" ? "Ty" : "AI"}:
            </span> {msg.content}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Wpisz wiadomość..."
          style={{ flex: 1, padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ padding: "8px 16px", borderRadius: 4, background: "#1976d2", color: "#fff", border: "none" }}>
          Wyślij
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
