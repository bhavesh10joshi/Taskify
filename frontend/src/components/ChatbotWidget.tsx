import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import axios from 'axios';

export const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await axios.post('/api/openai/chat', { messages: [...messages, userMsg] });
            setMessages(prev => [...prev, res.data.reply]);
        } catch (error) {
            setMessages(prev => [...prev, { role: "assistant", content: "Oops, I'm having trouble connecting right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-24 md:bottom-8 right-6 z-50 p-4 rounded-full bg-gradient-to-tr from-primary to-primary-container text-background shadow-[0_10px_25px_rgba(186,158,255,0.4)] hover:scale-105 active:scale-95 transition-all ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
                <MessageSquare size={24} />
            </button>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-24 md:bottom-8 right-6 w-[90vw] max-w-[380px] h-[500px] max-h-[70vh] z-50 bg-surface-container-high/95 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div className="flex items-center gap-2 text-slate-100 font-headline font-bold">
                                <Bot size={20} className="text-primary" /> Taskify AI
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.length === 0 && (
                                <div className="text-center text-slate-500 text-sm mt-10">
                                    Hi there! I'm your productivity assistant. How can I help you today?
                                </div>
                            )}
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-primary text-background rounded-br-sm' : 'bg-surface-container-highest text-slate-200 border border-white/5 rounded-bl-sm'}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="px-4 py-2 rounded-2xl bg-surface-container-highest text-slate-400 border border-white/5 rounded-bl-sm text-sm flex gap-1 items-center">
                                        <span className="animate-bounce">.</span><span className="animate-bounce delay-75">.</span><span className="animate-bounce delay-150">.</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-black/20 flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask something..."
                                className="flex-1 bg-surface-container border border-white/5 rounded-xl px-4 py-2 text-sm text-slate-200 outline-none focus:border-primary transition-colors"
                            />
                            <button type="submit" disabled={isLoading || !input.trim()} className="p-2 bg-primary text-background rounded-xl disabled:opacity-50 hover:bg-primary-container transition-colors">
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
