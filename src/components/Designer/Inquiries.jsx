import { useState, useEffect } from "react";

export default function Inquiries() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    const stored = JSON.parse(localStorage.getItem("userMessages")) || [];
    setMessages(stored);
  };

  const replyToMessage = (index, replyText) => {
    if (!replyText.trim()) return;
    const updated = [...messages];
    updated[index].reply = replyText;
    updated[index].repliedAt = new Date().toISOString();
    setMessages(updated);
    localStorage.setItem("userMessages", JSON.stringify(updated));
    alert("Reply sent!");
  };

  return (
    <div className="inquiries-section">
      <h2>Customer Inquiries</h2>
      {messages.length === 0 ? (
        <div className="no-messages">No messages from customers yet.</div>
      ) : (
        messages.map((msg, idx) => (
          <div key={idx} className="message-card">
            <div className="message-header">
              <strong>{msg.userName || msg.userEmail}</strong>
              <span className="timestamp">{new Date(msg.timestamp).toLocaleString()}</span>
            </div>
            <div className="message-product">Product: {msg.product}</div>
            <div className="message-text">"{msg.text}"</div>
            {msg.reply ? (
              <div className="reply-display">
                <strong>Your reply:</strong> {msg.reply}
                <small>Sent: {new Date(msg.repliedAt).toLocaleString()}</small>
              </div>
            ) : (
              <div className="reply-input">
                <input 
                  type="text" 
                  placeholder="Type your reply..." 
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      replyToMessage(idx, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
                <button onClick={(e) => {
                  const input = e.target.previousSibling;
                  replyToMessage(idx, input.value);
                  input.value = "";
                }}>Send Reply</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}