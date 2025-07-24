
import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatBot from './ChatBot';

const ChatFloatingButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-4 right-4 bg-floral-pink text-white p-4 rounded-full shadow-lg hover:bg-floral-pink-dark transition-all duration-300 z-40 animate-gentle-sway"
        aria-label="Abrir chat de ayuda"
      >
        <MessageCircle size={24} />
      </button>
      
      <ChatBot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
};

export default ChatFloatingButton;
