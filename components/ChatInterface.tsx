import React, { useState, useRef, useEffect } from 'react';
import { Message, User } from '../types';
import { generateResponse } from '../services/gemini';
import { Send, Bot, User as UserIcon, Loader2, Ticket as TicketIcon, Link as LinkIcon } from 'lucide-react';

interface ChatInterfaceProps {
  user: User;
  onRaiseTicket: (question: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, onRaiseTicket }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello ${user.name}! I am CampusGPT. Ask me anything about classes, events, news, or directions around campus.`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for Gemini (convert to API format)
      const history = messages.slice(1).map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await generateResponse(userMsg.text, user.role, history);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        timestamp: Date.now(),
        sources: response.sources,
        suggestTicket: response.suggestTicket
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Sorry, I encountered an error while processing your request.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 scrollbar-hide">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-brand-100 text-brand-600' : 'bg-white border border-slate-200 text-brand-600'
              }`}>
                {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={18} />}
              </div>
              
              <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-brand-600 text-white rounded-tr-sm' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
                }`}>
                  {msg.text}
                </div>

                {/* Sources Section */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="bg-slate-100 rounded-lg p-2 text-xs w-full">
                    <p className="font-semibold text-slate-500 mb-1 flex items-center gap-1">
                      <LinkIcon size={10} /> Sources:
                    </p>
                    <ul className="space-y-1">
                      {msg.sources.map((src, idx) => (
                        <li key={idx}>
                          <a href={src.uri} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline truncate block max-w-[250px]">
                            {src.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Raise Ticket Suggestion */}
                {msg.suggestTicket && (
                  <button
                    onClick={() => onRaiseTicket(messages[messages.indexOf(msg) - 1]?.text || "Help needed")}
                    className="flex items-center gap-2 text-xs font-medium bg-amber-50 text-amber-700 px-3 py-2 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors"
                  >
                    <TicketIcon size={14} />
                    I don't know the answer. Raise a Ticket to the Community?
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
        <div className="max-w-4xl mx-auto relative shadow-lg rounded-xl">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about events, classes, or campus info..."
            className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none h-14 bg-white text-slate-800 shadow-sm"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-2">CampusGPT can make mistakes. Verify important info.</p>
      </div>
    </div>
  );
};

export default ChatInterface;