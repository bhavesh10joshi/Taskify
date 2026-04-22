import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store';

const TargetView = () => {
    const { goals, addGoal, deleteGoal, updateGoalProgress } = useStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newTargetValue, setNewTargetValue] = useState(100);

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        addGoal(newTitle, newTargetValue);
        setNewTitle('');
        setNewTargetValue(100);
        setIsAdding(false);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8 pb-32">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <Target size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-headline font-bold text-slate-50">Current Targets</h2>
                    <p className="text-sm text-on-surface-variant">Stay consistent and track your macros.</p>
                </div>
            </div>

            <div className="space-y-6">
                {goals.map((goal, i) => {
                    const percent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
                    return (
                        <div key={goal._id} className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 group relative">
                            <button onClick={() => deleteGoal(goal._id)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 size={16} />
                            </button>
                            <div className="flex justify-between items-center text-sm font-medium pr-8">
                                <span className="text-slate-100 text-lg font-headline">{goal.title}</span>
                                <span className={i % 2 === 0 ? "text-secondary text-lg" : "text-tertiary text-lg"}>
                                    {percent}%
                                </span>
                            </div>
                            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percent}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className={`h-full progress-streak rounded-full bg-gradient-to-r ${
                                        i % 2 === 0 
                                        ? 'from-secondary to-secondary-dim shadow-[0_0_10px_rgba(83,221,252,0.3)]' 
                                        : 'from-tertiary to-tertiary-dim shadow-[0_0_10px_rgba(236,99,255,0.3)]'
                                    }`}>
                                </motion.div>
                            </div>
                            <div className="flex justify-between items-center text-xs text-slate-500 font-bold tracking-wider pt-2">
                                <span>{goal.currentValue} / {goal.targetValue}</span>
                                <button onClick={() => updateGoalProgress(goal._id, goal.currentValue + 1)} className="flex items-center gap-1 text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
                                    <TrendingUp size={14} /> +1 Progress
                                </button>
                            </div>
                        </div>
                    );
                })}

                {isAdding ? (
                    <form onSubmit={handleAddGoal} className="glass-panel p-4 rounded-2xl border border-white/10 space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Goal Title</label>
                            <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} required autoFocus placeholder="E.g. Full-Stack Mastery" className="w-full mt-1 bg-surface-container-highest border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-200 focus:ring-1 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Target Value</label>
                            <input type="number" value={newTargetValue} onChange={e => setNewTargetValue(parseInt(e.target.value) || 1)} min="1" required className="w-full mt-1 bg-surface-container-highest border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-200 focus:ring-1 focus:ring-primary outline-none" />
                        </div>
                        <div className="flex gap-2">
                            <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 text-slate-400 font-bold text-sm bg-white/5 rounded-xl hover:bg-white/10 transition-colors">Cancel</button>
                            <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-primary to-primary-container text-background font-bold text-sm rounded-xl">Save Target</button>
                        </div>
                    </form>
                ) : (
                    <button onClick={() => setIsAdding(true)} className="w-full py-4 rounded-xl border border-dashed border-white/20 text-slate-400 hover:text-slate-100 hover:border-white/40 transition-colors font-medium flex items-center justify-center gap-2">
                        <Plus size={18} /> <span>Add New Target</span>
                    </button>
                )}
            </div>
            
            {/* Consistency Analytics (Heatmap) */}
            <section className="space-y-4 mt-12 border-t border-white/5 pt-8">
                <h2 className="text-xl font-headline font-bold text-slate-50 tracking-tight">Consistency</h2>
                <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">7-Day Streak</span>
                        <span className="text-xs text-primary font-bold">Lvl 14 Kineticist</span>
                    </div>
                    <div className="flex justify-between gap-2">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, ix) => (
                            <div key={ix} className={`flex-1 aspect-square rounded-lg flex items-center justify-center 
                                ${ix === 5 ? 'bg-primary border-2 border-white/20 shadow-[0_0_15px_rgba(186,158,255,0.4)] text-background' 
                                : ix < 5 ? 'bg-primary-container/40 border border-primary/40' 
                                : 'bg-surface-container-highest opacity-40'}`}>
                                <span className="text-[10px] font-bold">{day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default TargetView;
