import { useState, useRef, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am your assistant. How can I help you today?' }
  ]);

  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase().trim();

    if (input.includes('hello') || input.includes('hi')) {
      return 'Hello there ☺️';
    }
    if (input.includes('how are you') || input.includes('kaise ho')) {
      return 'I am a bot, but I am doing good!';
    }
    if (input.includes('your name')) {
      return 'I am a simple chatbot 🙂';
    }
    if (input.includes('bye')) {
      return 'Good Bye!! Have a great Day 😁';
    }

    return "Sorry! I did not understand that 😂";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    const botReply = { sender: 'bot', text: getBotResponse(input) };

    setMessages((prev) => [...prev, userMessage, botReply]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, id) => (
            <div
              key={id}
              className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Type your message......."
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </>
  );
}

export default App;
