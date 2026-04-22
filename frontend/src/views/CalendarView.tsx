import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Check, Map } from 'lucide-react';
import { useStore } from '../store';

const CalendarView = () => {
    const { user, tasks, toggleTask, updateMonthlyGoalsText } = useStore();
    const [selectedDate, setSelectedDate] = useState(new Date());

    const isSameDay = (d1: Date, d2: Date) => {
        d1 = new Date(d1); d2 = new Date(d2);
        return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    };

    const displayTasks = tasks.filter(t => isSameDay(t.date || new Date(), selectedDate));

    // Generate upcoming days
    const days = Array.from({length: 14}).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - 2 + i);
        return d;
    });

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8 pb-32">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center text-tertiary">
                    <CalendarIcon size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-headline font-bold text-slate-50">Schedule</h2>
                    <p className="text-sm text-on-surface-variant">Review your historical and upcoming tasks.</p>
                </div>
            </div>

            {/* Monthly Goals Anchor */}
            <div className="glass-panel p-1 rounded-2xl border border-white/5 bg-surface-container-highest/20 group">
                <div className="flex items-center gap-2 p-3 font-bold text-sm tracking-widest uppercase text-tertiary">
                    <Map size={16} /> Monthly Objectives
                </div>
                <textarea 
                    value={user?.monthlyGoalsText || ''}
                    onChange={e => updateMonthlyGoalsText(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-slate-200 placeholder:text-on-surface-variant/40 px-4 pb-4 min-h-[80px] resize-none font-body text-sm" 
                    placeholder="List this month's major objectives here...">
                </textarea>
            </div>

            {/* Date Scroller */}
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6 pt-4">
                {days.map((date, i) => {
                    const isSelected = isSameDay(date, selectedDate);
                    return (
                        <button key={i} onClick={() => setSelectedDate(date)}
                            className={`min-w-[60px] flex flex-col items-center p-3 rounded-2xl border transition-all ${
                                isSelected 
                                ? 'bg-gradient-to-b from-primary to-primary-container border-primary/50 text-background shadow-[0_0_15px_rgba(186,158,255,0.4)]' 
                                : 'bg-surface-container-high border-white/5 text-slate-400 hover:bg-white/5'
                            }`}>
                            <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-background/80' : 'text-slate-500'}`}>
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </span>
                            <span className={`text-lg font-headline font-bold mt-1 ${isSelected ? 'text-background' : 'text-slate-200'}`}>
                                {date.getDate()}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/5 min-h-[300px]">
                <h3 className="text-lg font-semibold text-slate-200 mb-6 border-b border-white/5 pb-2">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h3>
                
                {displayTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center space-y-2 opacity-50">
                        <CalendarIcon size={32} className="text-slate-500" />
                        <p className="text-sm text-slate-400">No tasks on this date.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {displayTasks.map(task => (
                            <div key={task._id} 
                                onClick={() => toggleTask(task._id, !task.isCompleted)}
                                className="p-3 rounded-xl bg-surface-container hover:bg-white/5 flex items-center gap-4 cursor-pointer transition-colors group border border-transparent hover:border-white/5">
                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors flex-shrink-0 ${
                                    task.isCompleted 
                                        ? 'bg-primary text-background' 
                                        : 'border border-primary/40 text-transparent group-hover:border-primary'
                                }`}>
                                    <Check size={14} className={task.isCompleted ? 'opacity-100' : 'opacity-0'} />
                                </div>
                                <span className={`font-medium transition-all text-sm ${task.isCompleted ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                                    {task.title}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default CalendarView;
