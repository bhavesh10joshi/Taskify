import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Trash2, Zap, Target } from 'lucide-react';
import { useStore } from '../store';

const DashboardView = () => {
    const { quote, tasks, goals, toggleTask, addTask, deleteTask } = useStore();
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isTomorrow, setIsTomorrow] = useState(false);
    const [selectedGoalId, setSelectedGoalId] = useState('');

    // Simplistic date matching
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const isSameDay = (d1: Date, d2: Date) => {
        d1 = new Date(d1); d2 = new Date(d2);
        return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    };

    const todayTasks = tasks.filter(t => isSameDay(t.date || new Date(), today));
    const tomorrowTasks = tasks.filter(t => isSameDay(t.date || new Date(), tomorrow));

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        const targetDate = isTomorrow ? tomorrow : today;
        addTask(newTaskTitle, targetDate, selectedGoalId || undefined);
        setNewTaskTitle('');
        setSelectedGoalId('');
    };

    const TaskCard = ({ task }: { task: any }) => (
        <motion.div layout key={task._id} 
            className="glass-panel p-4 rounded-xl border border-white/5 flex items-center justify-between group transition-all">
            <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => toggleTask(task._id, !task.isCompleted)}>
                <div className={`w-6 h-6 flex-shrink-0 rounded-lg flex items-center justify-center transition-colors ${
                    task.isCompleted 
                        ? 'bg-gradient-to-tr from-primary to-primary-container text-white' 
                        : 'border-2 border-primary/40 text-transparent'
                }`}>
                    <Check size={16} className={`transition-opacity ${task.isCompleted ? 'opacity-100' : 'opacity-0'}`} />
                </div>
                <div className="flex flex-col">
                    <span className={`font-medium transition-all ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
                        {task.title}
                    </span>
                    {task.goalId && goals.some(g => g._id === task.goalId) && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1 mt-1">
                            <Target size={10} /> {goals.find(g => g._id === task.goalId)?.title}
                        </span>
                    )}
                </div>
            </div>
            <button onClick={() => deleteTask(task._id)} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                <Trash2 size={18} />
            </button>
        </motion.div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8 pb-40">
            {/* Hero AI Quote */}
            <section className="space-y-2">
                <p className="text-on-surface-variant text-sm font-medium tracking-wide uppercase">Daily Spark</p>
                <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <p className="text-lg font-headline font-semibold text-slate-50 italic leading-relaxed">
                        "{quote}"
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-primary">
                        <Zap size={16} />
                        <span className="text-xs font-bold tracking-widest uppercase">AI Insight</span>
                    </div>
                </div>
            </section>

            {/* Today's Focus */}
            <section className="space-y-4">
                <div className="flex justify-between items-end">
                    <h2 className="text-2xl font-headline font-bold text-slate-50 tracking-tight">Today's Focus</h2>
                    <span className="text-on-surface-variant text-sm pb-1">{today.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}</span>
                </div>
                <div className="space-y-3">
                    {todayTasks.length === 0 && <p className="text-slate-500 text-sm italic py-2">No tasks scheduled for today.</p>}
                    {todayTasks.map(task => <TaskCard key={task._id} task={task} />)}
                </div>
            </section>

            {/* Plan Tomorrow */}
            <section className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-end">
                    <h2 className="text-2xl font-headline font-bold text-slate-50 tracking-tight">Plan Tomorrow</h2>
                    <span className="text-on-surface-variant text-sm pb-1">{tomorrow.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}</span>
                </div>
                <div className="space-y-3">
                    {tomorrowTasks.length === 0 && <p className="text-slate-500 text-sm italic py-2">No tasks scheduled for tomorrow.</p>}
                    {tomorrowTasks.map(task => <TaskCard key={task._id} task={task} />)}
                </div>
            </section>

            {/* Add Task Form - Made it fixed to bottom on dashboard page instead of inline sticky to prevent overlap */}
            <div className="fixed bottom-24 left-0 right-0 z-40 max-w-md mx-auto px-4 pointer-events-none">
                <section className="pointer-events-auto">
                    <form onSubmit={handleAddTask} className="glass-panel p-3 rounded-2xl border border-white/10 flex flex-col gap-2 shadow-2xl bg-surface-container-high/95 backdrop-blur-xl">
                        <div className="flex gap-2 w-full">
                            <input type="text" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} 
                                placeholder="Add a new task..." 
                                className="flex-1 min-w-0 bg-transparent border-none text-sm text-slate-100 px-2 focus:ring-0 placeholder:text-slate-500" />
                            <button type="submit" className="p-2 flex-shrink-0 rounded-xl bg-gradient-to-tr from-primary to-primary-container text-background active:scale-95 transition-transform hover:shadow-[0_0_15px_rgba(186,158,255,0.4)]">
                                <Plus size={20} />
                            </button>
                        </div>
                        <div className="flex items-center justify-between gap-2 px-2 border-t border-white/5 pt-2">
                            <div className="flex gap-1">
                                <button type="button" onClick={() => setIsTomorrow(!isTomorrow)} 
                                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors ${!isTomorrow ? 'bg-primary text-background' : 'text-slate-400 hover:bg-white/5'}`}>
                                    Today
                                </button>
                                <button type="button" onClick={() => setIsTomorrow(!isTomorrow)} 
                                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors ${isTomorrow ? 'bg-primary text-background' : 'text-slate-400 hover:bg-white/5'}`}>
                                    Tmrw
                                </button>
                            </div>
                            
                            {goals.length > 0 && (
                                <select 
                                    value={selectedGoalId} 
                                    onChange={(e) => setSelectedGoalId(e.target.value)}
                                    className="bg-surface-container border border-white/5 text-slate-300 text-xs rounded-lg px-2 py-1 outline-none focus:border-primary max-w-[120px]">
                                    <option value="">No Target</option>
                                    {goals.map(g => <option key={g._id} value={g._id}>{g.title}</option>)}
                                </select>
                            )}
                        </div>
                    </form>
                </section>
            </div>
        </motion.div>
    );
};

export default DashboardView;
