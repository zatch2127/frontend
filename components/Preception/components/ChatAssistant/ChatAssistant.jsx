import React, { useState } from 'react';
import { useDashboard } from '../../context/Dashboardcontext';
import Card from '../../UI/Card';
import Button from '../../UI/Button';

const ChatAssistant = () => {
  const { isChatOpen, setIsChatOpen } = useDashboard();
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hey! How can I help you?', sender: 'bot' },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const newMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: 'I understand. Let me help you with that.',
          sender: 'bot',
        },
      ]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isChatOpen ? (
        <Card className="w-80 md:w-96 shadow-2xl" padding="p-0">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-rose-400 via-rose-500 to-pink-500 text-white p-4 rounded-t-xl flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">DrBuddy</h3>
              <p className="text-xs text-white/90">Ask me anything</p>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages Container */}
          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
          </div>

          {/* Quick Action */}
          <div className="px-4 py-3 bg-white border-t border-gray-200">
            <Button
              variant="secondary"
              size="sm"
              className="w-full text-xs"
              onClick={() => alert('Connecting to patient...')}
            >
              Help me with this Patient
            </Button>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200 rounded-b-xl flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="type and press [enter]"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              className="w-10 h-10 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-lg flex items-center justify-center hover:shadow-lg transition-all hover:scale-105"
            >
              ➤
            </button>
          </div>
        </Card>
      ) : (
        <button
          onClick={() => setIsChatOpen(true)}
          className="w-14 h-14 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        >
          <span className="text-2xl">💬</span>
        </button>
      )}
    </div>
  );
};

// Chat Message Component
const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <div
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-fadeIn`}
    >
      <div
        className={`
          max-w-[80%] p-3 rounded-lg text-sm
          ${
            isBot
              ? 'bg-white text-gray-800 shadow-sm'
              : 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-md'
          }
        `}
      >
        {message.text}
      </div>
    </div>
  );
};

export default ChatAssistant;
