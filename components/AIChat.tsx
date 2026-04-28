import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

import { RAGService } from '../utils/ragService';

// ... (Interface Message kept same)

const AIChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            text: "Hi! I'm the EcoBid AI Assistant. I can help you with Bidding, App Navigation, Eligibility, and Payment rules. Ask me anything!",
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // Simulate AI thinking and response using RAG Service
        setTimeout(() => {
            const { response } = RAGService.generateResponse(userMsg.text);

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: response,
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            <div
                className={`pointer-events-auto bg-white rounded-2xl shadow-2xl w-[90vw] sm:w-96 mb-4 overflow-hidden transition-all duration-300 origin-bottom-right border border-gray-100 flex flex-col max-h-[70vh]
        ${isOpen ? 'scale-100 opacity-100 h-[500px]' : 'scale-50 opacity-0 h-0 w-0'}`}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-eco-green to-eco-darkGreen p-4 flex justify-between items-center text-white shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm">
                            <Bot size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">EcoBid Assistant</h3>
                            <p className="text-xs text-eco-lightGreen opacity-90">Always here to help</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Close chat"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm
                ${msg.sender === 'user'
                                        ? 'bg-eco-green text-white rounded-tr-none'
                                        : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'}`}
                            >
                                {msg.text}
                                <div
                                    className={`text-[10px] mt-1 text-right
                    ${msg.sender === 'user' ? 'text-eco-lightGreen/80' : 'text-gray-400'}`}
                                >
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex w-full justify-start">
                            <div className="bg-white text-gray-400 border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 text-sm shadow-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 shrink-0 flex gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Ask about terms, eligibility..."
                        className="flex-1 bg-gray-100 text-gray-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-eco-green/50 transition-all border border-transparent focus:bg-white"
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim()}
                        className="p-2 bg-eco-green text-white rounded-full hover:bg-eco-darkGreen active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-eco-green/20"
                        aria-label="Send message"
                    >
                        <Send size={18} className="translate-x-0.5" />
                    </button>
                </form>
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group font-semibold tracking-wide
        ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-eco-green hover:bg-eco-darkGreen'}`}
                aria-label="Toggle chat assistant"
            >
                {isOpen ? (
                    <>
                        <span className="text-white hidden sm:inline">Close</span>
                        <X size={24} className="text-white" />
                    </>
                ) : (
                    <>
                        <span className="text-white">AI Help</span>
                        <MessageSquare size={24} className="text-white group-hover:animate-pulse" />
                    </>
                )}
            </button>
        </div>
    );
};

export default AIChat;
