import { motion } from 'framer-motion';
import { BarChart, Activity, CheckCircle, Target as TargetIcon } from 'lucide-react';
import { useStore } from '../store';

const AnalyticsView = () => {
    const { tasks, goals } = useStore();

    // Compute simple global completion
    const completedTasks = tasks.filter(t => t.isCompleted).length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const overallGoalProgress = goals.length > 0 
        ? Math.round(goals.reduce((acc: number, g: any) => acc + (g.currentValue / g.targetValue), 0) / goals.length * 100)
        : 0;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8 pb-32">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shadow-[0_0_15px_rgba(83,221,252,0.2)]">
                    <BarChart size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-headline font-bold text-slate-50">Analytics</h2>
                    <p className="text-sm text-on-surface-variant">Your historical performance overview.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <CheckCircle size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Completion Rate</span>
                    </div>
                    <div className="text-4xl font-headline font-bold text-slate-50">{completionRate}%</div>
                    <p className="text-slate-500 text-sm">{completedTasks} of {totalTasks} tasks completed across all time.</p>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <TargetIcon size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Overall Goal Macro</span>
                    </div>
                    <div className="text-4xl font-headline font-bold text-secondary">{overallGoalProgress}%</div>
                    <p className="text-slate-500 text-sm">Aggregate tracking of all your active targets.</p>
                </div>
            </div>

            {/* Consistency Graph Placeholder */}
            <section className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-lg font-semibold text-slate-200">Consistency Flow</h3>
                <div className="glass-panel p-8 rounded-2xl border border-white/5 h-64 flex flex-col items-center justify-center text-center group cursor-default">
                    <Activity size={48} className="text-slate-600 mb-4 group-hover:text-primary transition-colors" />
                    <p className="text-slate-400 font-medium">Trajectory graph mapping your daily output will appear here as you accumulate data.</p>
                </div>
            </section>
        </motion.div>
    );
};

export default AnalyticsView;
