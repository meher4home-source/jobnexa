
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { createChatSession } from '../services/geminiService';
import { ChatMessage, UserProfile } from '../types';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface DoubtChatProps {
  profile: UserProfile;
  isPremium: boolean;
  onGoPremium: () => void;
}

const DoubtChat: React.FC<DoubtChatProps> = ({ profile, isPremium, onGoPremium }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const FREE_LIMIT = 5;

  const getUsage = () => parseInt(localStorage.getItem(`usage_chat_${new Date().toISOString().split('T')[0]}`) || '0', 10);

  useEffect(() => {
    const saved = localStorage.getItem(`chat_history_${profile.email}`);
    if (saved) setMessages(JSON.parse(saved));
    else setMessages([{ role: 'model', text: `Hi ${profile.fullName}! How can I help your career today?`, timestamp: Date.now() }]);
    chatSessionRef.current = createChatSession();
  }, [profile.email]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (messages.length) localStorage.setItem(`chat_history_${profile.email}`, JSON.stringify(messages));
  }, [messages, profile.email]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || (!isPremium && getUsage() >= FREE_LIMIT)) return;

    const text = input;
    setInput('');
    setMessages(p => [...p, { role: 'user', text, timestamp: Date.now() }]);
    setIsTyping(true);
    
    if (!isPremium) localStorage.setItem(`usage_chat_${new Date().toISOString().split('T')[0]}`, (getUsage() + 1).toString());

    try {
      const res = await chatSessionRef.current.sendMessage({ message: text });
      setMessages(p => [...p, { role: 'model', text: res.text, timestamp: Date.now() }]);
    } catch(e) {
      setMessages(p => [...p, { role: 'model', text: "Connection error.", timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
        <div>
            <h3 className="font-bold text-slate-800">Coach AI</h3>
            <p className="text-xs text-slate-500">Quick, direct advice.</p>
        </div>
        {!isPremium && <span className="text-xs bg-slate-200 px-2 py-1 rounded text-slate-600">{getUsage()}/{FREE_LIMIT} msgs</span>}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 max-w-[85%] rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'}`}>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isTyping && <div className="text-xs text-slate-400 ml-4 animate-pulse">Typing...</div>}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
        {(!isPremium && getUsage() >= FREE_LIMIT) ? (
            <button type="button" onClick={onGoPremium} className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-bold">Upgrade to Chat</button>
        ) : (
            <>
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask anything..." className="flex-1 bg-slate-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="submit" disabled={!input.trim()} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"><PaperAirplaneIcon className="w-5 h-5"/></button>
            </>
        )}
      </form>
    </div>
  );
};

export default DoubtChat;
