import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Bot, Send, Save, BookOpen } from 'lucide-react';
import { useStore } from '../store';

const MessagesView = () => {
    const { note, updateNote, chatHistory, sendChatMessage } = useStore();
    const [msg, setMsg] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!msg.trim()) return;
        sendChatMessage(msg);
        setMsg('');
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8 pb-32">
            
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary-container">
                    <MessageSquare size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-headline font-bold text-slate-50">Assistant</h2>
                    <p className="text-sm text-on-surface-variant">Chat with your AI or leave quick notes.</p>
                </div>
            </div>

            {/* Quick Thoughts Notebook */}
            <section className="space-y-4">
                <div className="flex gap-2 items-center text-slate-300 font-headline font-semibold">
                    <BookOpen size={18} /> Scratchpad
                </div>
                <div className="glass-panel p-1 rounded-2xl border border-white/5 bg-surface-container-high/40 focus-within:bg-surface-container-high/80 transition-colors">
                    <textarea 
                        value={note?.content || ''}
                        onChange={e => useStore.setState({ note: { content: e.target.value } })}
                        className="w-full bg-transparent border-none focus:ring-0 text-slate-200 placeholder:text-on-surface-variant/40 p-4 min-h-[100px] resize-none font-body text-sm" 
                        placeholder="Draft ideas, paste links, or write quick thoughts...">
                    </textarea>
                    <div className="px-4 pb-4 flex justify-end">
                        <button 
                            onClick={() => updateNote(note.content)}
                            className="bg-surface-container border border-white/10 hover:bg-white/10 text-slate-200 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 active:scale-95 transition-all">
                            <Save size={14} />
                            Save Note
                        </button>
                    </div>
                </div>
            </section>

            {/* AI Chat Window */}
            <section className="space-y-4">
                <div className="flex gap-2 items-center text-primary font-headline font-semibold">
                    <Bot size={18} /> Ask AI
                </div>
                <div className="glass-panel rounded-2xl border border-white/5 flex flex-col h-[350px] overflow-hidden bg-[#0a0f1d]">
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                        {chatHistory.map((chat, i) => (
                            <div key={i} className={`flex ${chat.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                    chat.role === 'ai' 
                                    ? 'bg-surface-container-high text-slate-200 rounded-tl-sm' 
                                    : 'bg-primary-container text-on-primary-container rounded-tr-sm'
                                }`}>
                                    {chat.content}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <form onSubmit={handleSend} className="p-2 border-t border-white/5 bg-surface-container-highest flex gap-2">
                        <input 
                            type="text" 
                            value={msg} 
                            onChange={e => setMsg(e.target.value)} 
                            placeholder="Message Assistant..." 
                            className="flex-1 bg-transparent border-none text-sm text-slate-100 px-3 focus:ring-0 placeholder:text-slate-500"
                        />
                        <button type="submit" className="w-10 h-10 rounded-xl bg-primary text-background flex items-center justify-center active:scale-95 transition-transform hover:shadow-[0_0_15px_rgba(186,158,255,0.4)] disabled:opacity-50">
                            <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
                        </button>
                    </form>
                </div>
            </section>
        </motion.div>
    );
};

export default MessagesView;
