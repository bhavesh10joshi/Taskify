import { useState, useEffect } from 'react';
import { Bell, Target, Calendar, MessageSquare, Settings, LayoutDashboard } from 'lucide-react';
import { useStore } from './store';
import { AnimatePresence } from 'framer-motion';

import DashboardView from './views/DashboardView';
import TargetView from './views/TargetView';
import CalendarView from './views/CalendarView';
import MessagesView from './views/MessagesView';
import SettingsView from './views/SettingsView';

function App() {
    const { user, fetchInsights } = useStore();
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        fetchInsights();
    }, []);

    const name = user?.name || "Alex";

    return (
        <div className="dark min-h-screen selection:bg-primary-container/30 pb-24 relative overflow-hidden">
            {/* Top Navigation Anchor */}
            <header className="bg-[#070d1f]/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] docked full-width top-0 z-40 fixed w-full">
                <div className="flex justify-between items-center w-full px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-surface-container-high">
                            <img alt="User" className="w-full h-full object-cover" src="https://ui-avatars.com/api/?name=Alex&background=random" />
                        </div>
                        <h1 className="font-headline font-bold text-slate-100 text-lg">Welcome back, {name}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="text-[#ba9eff] hover:bg-white/5 transition-colors p-2 rounded-full active:scale-95 duration-200">
                            <Bell size={24} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="pt-24 px-6 max-w-md mx-auto relative z-10">
                <AnimatePresence mode="wait">
                    {activeTab === 'dashboard' && <DashboardView key="dashboard" />}
                    {activeTab === 'target' && <TargetView key="target" />}
                    {activeTab === 'calendar' && <CalendarView key="calendar" />}
                    {activeTab === 'messages' && <MessagesView key="messages" />}
                    {activeTab === 'settings' && <SettingsView key="settings" />}
                </AnimatePresence>
            </main>

            {/* Bottom Navigation Shell */}
            <nav className="fixed bottom-6 left-0 right-0 z-50 flex justify-around items-center max-w-md mx-auto px-4 py-2 bg-white/5 backdrop-blur-3xl w-[90%] rounded-full border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]">
                <button 
                    onClick={() => setActiveTab('dashboard')} 
                    className={`p-3 rounded-full transition-all duration-150 active:scale-90 ${activeTab === 'dashboard' ? 'bg-gradient-to-tr from-[#ba9eff] to-[#ae8dff] text-white shadow-[0_0_15px_rgba(186,158,255,0.4)]' : 'text-slate-400 hover:text-slate-200'}`}>
                    <LayoutDashboard size={20} />
                </button>
                <button 
                    onClick={() => setActiveTab('target')} 
                    className={`p-3 rounded-full transition-all duration-150 active:scale-90 ${activeTab === 'target' ? 'bg-gradient-to-tr from-[#ba9eff] to-[#ae8dff] text-white shadow-[0_0_15px_rgba(186,158,255,0.4)]' : 'text-slate-400 hover:text-slate-200'}`}>
                    <Target size={20} />
                </button>
                <button 
                    onClick={() => setActiveTab('calendar')} 
                    className={`p-3 rounded-full transition-all duration-150 active:scale-90 ${activeTab === 'calendar' ? 'bg-gradient-to-tr from-[#ba9eff] to-[#ae8dff] text-white shadow-[0_0_15px_rgba(186,158,255,0.4)]' : 'text-slate-400 hover:text-slate-200'}`}>
                    <Calendar size={20} />
                </button>
                <button 
                    onClick={() => setActiveTab('messages')} 
                    className={`p-3 rounded-full transition-all duration-150 active:scale-90 ${activeTab === 'messages' ? 'bg-gradient-to-tr from-[#ba9eff] to-[#ae8dff] text-white shadow-[0_0_15px_rgba(186,158,255,0.4)]' : 'text-slate-400 hover:text-slate-200'}`}>
                    <MessageSquare size={20} />
                </button>
                <button 
                    onClick={() => setActiveTab('settings')} 
                    className={`p-3 rounded-full transition-all duration-150 active:scale-90 ${activeTab === 'settings' ? 'bg-gradient-to-tr from-[#ba9eff] to-[#ae8dff] text-white shadow-[0_0_15px_rgba(186,158,255,0.4)]' : 'text-slate-400 hover:text-slate-200'}`}>
                    <Settings size={20} />
                </button>
            </nav>
        </div>
    );
}

export default App;
