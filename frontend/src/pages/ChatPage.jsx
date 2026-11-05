import React, { useState } from 'react';
import {
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  CheckCheck,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'provider',
      senderName: 'Suresh Kumar (Electrician)',
      text: 'Hello Johne! I am on my way for your switchboard inspection. ETA is 12 minutes.',
      time: '11:15 AM'
    },
    {
      id: 2,
      sender: 'user',
      senderName: 'Johne Martin',
      text: 'Thank you Suresh! The main gate code is #402. Please let me know when you reach.',
      time: '11:17 AM'
    },
    {
      id: 3,
      sender: 'provider',
      senderName: 'Suresh Kumar (Electrician)',
      text: 'Noted! I have the genuine Schneider MCB parts with me.',
      time: '11:19 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      senderName: user?.name || 'Johne Martin',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setInputText('');
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex h-[640px] overflow-hidden transition-colors duration-300">
      {/* Sidebar: Conversations */}
      <div className="w-80 border-r border-slate-100 dark:border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700 rounded-xl text-xs text-slate-400">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search chats..."
              className="bg-transparent outline-none w-full text-slate-700 dark:text-slate-200 placeholder-slate-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800">
          <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors cursor-pointer flex items-center gap-3">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=150&q=80"
                alt="Suresh Kumar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-800 dark:text-white truncate">Suresh Quick Electricals</p>
                <span className="text-[10px] text-slate-400">11:19 AM</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                Noted! I have the genuine Schneider MCB...
              </p>
            </div>
          </div>

          <div className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors cursor-pointer flex items-center gap-3">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=150&q=80"
                alt="Ramesh Reddy"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-800 dark:text-white truncate">Reddy Plumbing Solutions</p>
                <span className="text-[10px] text-slate-400">Yesterday</span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                Job marked completed. Please verify escrow release in ₹.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="flex-1 flex flex-col justify-between bg-white dark:bg-[#0c1322]">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=150&q=80"
              alt="Suresh Kumar"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <span>Suresh Kumar</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-normal">
                  Locally Endorsed
                </span>
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Online • Active Job #BK-1082</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg hover:text-slate-600 dark:hover:text-slate-200">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg hover:text-slate-600 dark:hover:text-slate-200">
              <Video className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg hover:text-slate-600 dark:hover:text-slate-200">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fafbfe] dark:bg-[#080e1a]">
          <div className="text-center my-2">
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full">
              Today • Escrow Protected Communication
            </span>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-2xs rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.time}
              </span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0c1322] flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none text-slate-800 dark:text-slate-100 focus:border-indigo-400"
          />
          <button
            type="submit"
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
