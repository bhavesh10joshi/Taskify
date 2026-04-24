import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Trash2, Target, Copy } from 'lucide-react';
import { useStore } from '../store';

const DashboardView = () => {
    const { tasks, goals, toggleTask, addTask, deleteTask, copyTasksToTomorrow } = useStore();
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isTomorrow, setIsTomorrow] = useState(false);
    const [selectedGoalId, setSelectedGoalId] = useState('');

    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        // Automatically refresh the day context every minute to catch midnight rollovers
        const timer = setInterval(() => setCurrentDate(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(currentDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const taskDate = (dateStr: any) => {
        const d = new Date(dateStr || currentDate);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
    };

    // Today gets anything scheduled for today, or any incomplete tasks from the past
    const todayTasks = tasks.filter(t => {
        const td = taskDate(t.date);
        return td === today.getTime() || (td < today.getTime() && !t.isCompleted);
    });

    const tomorrowTasks = tasks.filter(t => taskDate(t.date) === tomorrow.getTime());

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
            className="glass-panel p-4 rounded-xl border border-white/5 flex items-center justify-between group transition-all hover:bg-white/5">
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col xl:flex-row gap-8 xl:gap-12 relative min-h-full pb-40 xl:pb-0">
            {/* Desktop Left: Today */}
            <div className="flex-1 space-y-4 flex flex-col h-[calc(100vh-140px)]">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <h2 className="text-3xl font-headline font-bold text-slate-50 tracking-tight">Today's Focus</h2>
                    <div className="flex items-center gap-4">
                        <button onClick={copyTasksToTomorrow} title="Copy to Tomorrow" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
                            <Copy size={16} /> <span className="hidden sm:inline">Copy to Tomorrow</span>
                        </button>
                        <span className="text-on-surface-variant font-medium">{today.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}</span>
                    </div>
                </div>
                <div className="space-y-3 pt-2 overflow-y-auto flex-1 pb-32 pr-2">
                    {todayTasks.length === 0 && <div className="text-slate-500 text-sm italic py-8 text-center bg-surface-container-highest/20 rounded-xl border border-white/5">No tasks scheduled for today. Take a breather.</div>}
                    {todayTasks.map(task => <TaskCard key={task._id} task={task} />)}
                </div>
            </div>

            {/* Desktop Right: Tomorrow */}
            <div className="flex-1 space-y-4 flex flex-col h-[calc(100vh-140px)]">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <h2 className="text-3xl font-headline font-bold text-slate-400 tracking-tight">Plan Tomorrow</h2>
                    <span className="text-on-surface-variant font-medium">{tomorrow.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}</span>
                </div>
                <div className="space-y-3 pt-2 overflow-y-auto flex-1 pb-32 pr-2">
                    {tomorrowTasks.length === 0 && <div className="text-slate-500 text-sm italic py-8 text-center bg-surface-container-highest/20 rounded-xl border border-white/5">No tasks queued up. Start plotting your next move.</div>}
                    {tomorrowTasks.map(task => <TaskCard key={task._id} task={task} />)}
                </div>
            </div>

            {/* Centralized Add Task Form using sticky */}
            <div className="xl:absolute xl:bottom-12 xl:left-1/2 xl:-translate-x-1/2 fixed bottom-24 left-0 right-0 z-40 max-w-2xl w-full mx-auto px-4 xl:px-0 pointer-events-none">
                <section className="pointer-events-auto">
                    <form onSubmit={handleAddTask} className="p-4 rounded-3xl border border-white/10 flex flex-col gap-3 shadow-[0_30px_50px_rgba(0,0,0,0.8)] bg-[#0f172a]/95 backdrop-blur-2xl">
                        <div className="flex gap-4 w-full items-center">
                            <input type="text" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} 
                                placeholder="What needs to be done?" 
                                className="flex-1 min-w-0 bg-transparent border-none text-base text-slate-100 px-2 focus:ring-0 placeholder:text-slate-500 outline-none" />
                            <button type="submit" className="p-3 flex-shrink-0 rounded-2xl bg-gradient-to-tr from-primary to-primary-container text-background active:scale-95 transition-transform shadow-[0_0_20px_rgba(186,158,255,0.2)] hover:shadow-[0_0_30px_rgba(186,158,255,0.4)]">
                                <Plus size={24} />
                            </button>
                        </div>
                        <div className="flex items-center justify-between gap-2 px-2 border-t border-white/5 pt-3">
                            <div className="flex gap-2 bg-surface-container-highest/50 p-1 rounded-xl">
                                <button type="button" onClick={() => setIsTomorrow(false)} 
                                    className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${!isTomorrow ? 'bg-primary text-background shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>
                                    Today
                                </button>
                                <button type="button" onClick={() => setIsTomorrow(true)} 
                                    className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${isTomorrow ? 'bg-primary text-background shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>
                                    Tmrw
                                </button>
                            </div>
                            
                            {goals.length > 0 && (
                                <select 
                                    value={selectedGoalId} 
                                    onChange={(e) => setSelectedGoalId(e.target.value)}
                                    className="bg-surface-container border border-white/10 text-slate-300 text-sm font-medium rounded-xl px-4 py-2 outline-none focus:border-primary cursor-pointer hover:bg-white/5 transition-colors">
                                    <option value="">Link to Target (Optional)</option>
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
