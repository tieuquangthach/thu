import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, StopCircle, RefreshCw } from 'lucide-react';
import MathRenderer from '../components/MathRenderer';
import { streamMathResponse } from '../services/geminiService';
import { Message, Sender } from '../types';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: 'Chào em! Thầy là Tiêu Quang Thạch. Em đang gặp khó khăn với bài toán nào? Hãy gửi đề bài cho thầy nhé!',
      sender: Sender.AI,
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
      text: input,
      sender: Sender.USER,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiMsgId = (Date.now() + 1).toString();
    const aiMsgPlaceholder: Message = {
      id: aiMsgId,
      text: '',
      sender: Sender.AI,
      timestamp: Date.now(),
      isStreaming: true
    };

    setMessages(prev => [...prev, aiMsgPlaceholder]);

    try {
      await streamMathResponse(
        messages, 
        userMsg.text,
        (currentText) => {
            setMessages(prev => prev.map(msg => 
                msg.id === aiMsgId ? { ...msg, text: currentText } : msg
            ));
        }
      );
    } catch (error) {
      setMessages(prev => prev.map(msg => 
          msg.id === aiMsgId ? { ...msg, text: "Xin lỗi, thầy đang gặp chút sự cố kết nối. Em thử lại sau nhé!" } : msg
      ));
    } finally {
        setMessages(prev => prev.map(msg => 
            msg.id === aiMsgId ? { ...msg, isStreaming: false } : msg
        ));
        setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
            <h2 className="text-xl font-bold text-slate-800">Góc Học Tập</h2>
            <p className="text-sm text-slate-500">Hỏi đáp trực tiếp cùng AI</p>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-4 max-w-4xl mx-auto ${
              msg.sender === Sender.USER ? 'flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.sender === Sender.USER ? 'bg-indigo-600' : 'bg-brand-600'
            }`}>
                {msg.sender === Sender.USER ? <User size={20} className="text-white" /> : <Bot size={20} className="text-white" />}
            </div>

            {/* Content */}
            <div className={`flex-1 rounded-2xl px-6 py-4 shadow-sm ${
                msg.sender === Sender.USER 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white border border-slate-100 text-slate-800'
            }`}>
                {msg.sender === Sender.AI ? (
                    <MathRenderer content={msg.text} />
                ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                )}
                {msg.isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-brand-500 animate-pulse">|</span>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4 md:p-6">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập bài toán em cần giải (ví dụ: Giải phương trình x^2 - 4 = 0)..."
            className="w-full pl-4 pr-14 py-4 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none shadow-sm text-slate-700 bg-slate-50"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-3 p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-2">
            AI có thể mắc lỗi. Hãy kiểm tra lại kết quả trước khi làm bài.
        </p>
      </div>
    </div>
  );
};

export default ChatPage;