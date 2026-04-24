import { motion } from 'framer-motion';
import { Settings, User, Moon, HelpCircle, LogOut } from 'lucide-react';
import { useStore } from '../store';

const SettingsView = () => {
    const { user } = useStore();

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8 pb-32 h-[calc(100vh-100px)] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-300">
                    <Settings size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-headline font-bold text-slate-50">Settings</h2>
                    <p className="text-sm text-on-surface-variant">Manage your account and app preferences.</p>
                </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-white/5 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                    <img alt="User" className="w-full h-full object-cover" src="https://ui-avatars.com/api/?name=Alex&background=random" />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-slate-100">{user?.name || 'Alex'}</h3>
                    <p className="text-sm text-slate-400 font-medium">Lvl 14 Kineticist</p>
                </div>
                <button className="ml-auto px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold text-slate-200 transition-colors">
                    Edit
                </button>
            </div>

            <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Preferences</h3>
                
                <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                    <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-white/5">
                        <div className="flex items-center gap-3 text-slate-200">
                            <User size={18} className="text-slate-400" /> Account Details
                        </div>
                    </button>
                    <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-white/5">
                        <div className="flex items-center gap-3 text-slate-200">
                            <Moon size={18} className="text-slate-400" /> Appearance
                        </div>
                        <span className="text-xs font-bold bg-primary/20 text-primary px-2 py-1 rounded-md">Dark</span>
                    </button>
                    <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left">
                        <div className="flex items-center gap-3 text-slate-200">
                            <HelpCircle size={18} className="text-slate-400" /> Help & Support
                        </div>
                    </button>
                </div>
            </div>

            <button className="w-full p-4 glass-panel rounded-2xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 font-bold">
                <LogOut size={18} /> Sign Out
            </button>
        </motion.div>
    );
};

export default SettingsView;
