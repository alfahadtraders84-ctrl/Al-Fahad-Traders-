import React, { useState } from 'react';
import { MessageCircle, X, Send, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ text: string, sender: 'user' | 'agent' }[]>([
    { text: "Hello! How can Al Fahad Traders help you today?", sender: 'agent' }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    
    setChat(prev => [...prev, { text: message, sender: 'user' }]);
    setMessage('');
    
    // Auto-reply mock
    setTimeout(() => {
      setChat(prev => [...prev, { text: "Thanks for your message. One of our agents will be with you shortly.", sender: 'agent' }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[360px] bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-[500px]"
          >
            <div className="bg-orange-600 p-6 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">AF</div>
                <div>
                  <h3 className="font-bold">Support Center</h3>
                  <p className="text-[10px] uppercase font-black opacity-60 tracking-widest">Always Active</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-auto p-6 space-y-4">
              {chat.map((m, i) => (
                <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium ${
                    m.sender === 'user' 
                      ? 'bg-gray-900 text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-900 rounded-bl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-gray-100 flex items-center space-x-2">
              <input 
                type="text" 
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 text-sm font-medium"
              />
              <button className="p-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors">
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-orange-200 hover:scale-110 active:scale-95 transition-all"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

export default SupportChat;
