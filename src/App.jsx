import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem('chat')) || [
      { sender: 'bot', text: 'Hi! I am your assistant. How can I help you today?' }
    ]
  );
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    localStorage.setItem('chat', JSON.stringify(messages));
  }, [messages]);

  // 🔍 Clean input text
  const preprocess = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/gi, '')
      .replace(/\biam\b/g, 'i am')
      .replace(/\bgud\b/g, 'good')
      .replace(/\bhelo\b/g, 'hello')
      .replace(/\bbords\b/g, 'bored')
      .replace(/\bstudnt\b/g, 'student')
      .replace(/\bpls\b/g, 'please')
      .replace(/\btnx\b/g, 'thanks')
      .trim();
  };

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const cleanedText = preprocess(text);
    const userMessage = { sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: cleanedText }),
      });

      const data = await res.json();
      setTimeout(() => {
        const botMessage = { sender: 'bot', text: data.reply };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 800);
    } catch (err) {
      console.error('Fetch error:', err);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '⚠️ Cannot connect to server!' }
      ]);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const clearChat = () => {
    localStorage.removeItem('chat');
    setMessages([{ sender: 'bot', text: 'Chat cleared. How can I assist now?' }]);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const downloadChat = () => {
    const text = messages.map(msg => `${msg.sender.toUpperCase()}: ${msg.text}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = 'chat_log.txt';
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  return (
    <div className={`chat-container ${darkMode ? 'dark' : ''}`}>
      <div className="header">
        <h2>ChatBot Assistant 🤖</h2>
        <div className="buttons">
          <button onClick={toggleDarkMode}>{darkMode ? '🌞 Light' : '🌙 Dark'}</button>
          <button onClick={clearChat}>🧹 Clear</button>
          <button onClick={downloadChat}>💾 Save Log</button>
        </div>
      </div>

      <div className="messages">
        {messages.map((msg, id) => (
          <div key={id} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isTyping && <div className="typing">Bot is typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
          value={input}
          onKeyDown={handleKeyDown}
        />
        <button onClick={() => handleSend()}>Send</button>
      </div>
    </div>
  );
}

export default App;
