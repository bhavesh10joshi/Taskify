import { useState, useEffect } from 'react';
import { Bell, Target, Calendar, BarChart2, Settings, LayoutDashboard, LogOut } from 'lucide-react';
import { useStore } from './store';
import { AnimatePresence } from 'framer-motion';

import DashboardView from './views/DashboardView';
import TargetView from './views/TargetView';
import CalendarView from './views/CalendarView';
import AnalyticsView from './views/AnalyticsView';
import SettingsView from './views/SettingsView';
import AuthView from './views/AuthView';

function App() {
    const { user, token, fetchInsights, logout } = useStore();
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        if (token) fetchInsights();
    }, [token]);

    if (!token) {
        return <AuthView />;
    }

    const name = user?.name || "Alex";

    const NavItems = () => (
        <>
            <button 
                onClick={() => setActiveTab('dashboard')} 
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-150 active:scale-95 w-full ${activeTab === 'dashboard' ? 'bg-gradient-to-tr from-[#ba9eff] to-[#ae8dff] text-white shadow-[0_0_15px_rgba(186,158,255,0.4)] md:translate-x-2' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                <LayoutDashboard size={20} /> <span className="hidden md:block font-medium">Dashboard</span>
            </button>
            <button 
                onClick={() => setActiveTab('target')} 
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-150 active:scale-95 w-full ${activeTab === 'target' ? 'bg-gradient-to-tr from-[#ba9eff] to-[#ae8dff] text-white shadow-[0_0_15px_rgba(186,158,255,0.4)] md:translate-x-2' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                <Target size={20} /> <span className="hidden md:block font-medium">Targets</span>
            </button>
            <button 
                onClick={() => setActiveTab('calendar')} 
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-150 active:scale-95 w-full ${activeTab === 'calendar' ? 'bg-gradient-to-tr from-[#ba9eff] to-[#ae8dff] text-white shadow-[0_0_15px_rgba(186,158,255,0.4)] md:translate-x-2' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                <Calendar size={20} /> <span className="hidden md:block font-medium">Schedule</span>
            </button>
            <button 
                onClick={() => setActiveTab('analytics')} 
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-150 active:scale-95 w-full ${activeTab === 'analytics' ? 'bg-gradient-to-tr from-[#ba9eff] to-[#ae8dff] text-white shadow-[0_0_15px_rgba(186,158,255,0.4)] md:translate-x-2' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                <BarChart2 size={20} /> <span className="hidden md:block font-medium">Analytics</span>
            </button>
            <button 
                onClick={() => setActiveTab('settings')} 
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-150 active:scale-95 w-full ${activeTab === 'settings' ? 'bg-gradient-to-tr from-[#ba9eff] to-[#ae8dff] text-white shadow-[0_0_15px_rgba(186,158,255,0.4)] md:translate-x-2' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                <Settings size={20} /> <span className="hidden md:block font-medium">Settings</span>
            </button>
        </>
    );

    return (
        <div className="dark min-h-screen selection:bg-primary-container/30 flex flex-col md:flex-row relative overflow-hidden bg-[#070d1f]">
            {/* Desktop Sidebar (Hidden on Mobile) */}
            <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-surface-container-high/40 backdrop-blur-3xl min-h-screen p-6 z-50 sticky top-0">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-background font-bold text-xl shadow-[0_0_20px_rgba(186,158,255,0.3)]">
                        T
                    </div>
                    <span className="font-headline font-bold text-xl text-slate-100 tracking-tight">Taskify</span>
                </div>

                <nav className="flex flex-col gap-2 flex-1">
                    <NavItems />
                </nav>

                <div className="mt-auto border-t border-white/10 pt-6">
                    <div className="flex items-center gap-3 mb-4">
                        <img alt="User" className="w-10 h-10 rounded-full border border-white/10 object-cover" src={`https://ui-avatars.com/api/?name=${name}&background=random`} />
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-slate-200 truncate">{name}</span>
                            <span className="text-[10px] text-slate-500 truncate">Pro Member</span>
                        </div>
                    </div>
                    <button onClick={logout} className="flex items-center gap-2 text-slate-500 hover:text-red-400 text-sm font-medium transition-colors w-full p-2 rounded-lg hover:bg-white/5">
                        <LogOut size={16} /> Sign out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen w-full md:max-w-[calc(100vw-256px)]">
                {/* Mobile Header (Hidden on Desktop) */}
                <header className="md:hidden bg-[#070d1f]/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] sticky top-0 z-40 w-full px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-surface-container-high">
                            <img alt="User" className="w-full h-full object-cover" src={`https://ui-avatars.com/api/?name=${name}&background=random`} />
                        </div>
                        <h1 className="font-headline font-bold text-slate-100 text-lg">Welcome, {name}</h1>
                    </div>
                    <button className="text-[#ba9eff] hover:bg-white/5 transition-colors p-2 rounded-full active:scale-95 duration-200" onClick={logout}>
                        <LogOut size={20} />
                    </button>
                </header>

                {/* Dashboard Spread (Responsive Grid scaling) */}
                <main className="flex-1 p-6 lg:p-12 w-full max-w-7xl mx-auto relative z-10 overflow-y-auto mb-24 md:mb-0">
                    <AnimatePresence mode="wait">
                        {activeTab === 'dashboard' && <DashboardView key="dashboard" />}
                        {activeTab === 'target' && <TargetView key="target" />}
                        {activeTab === 'calendar' && <CalendarView key="calendar" />}
                        {activeTab === 'analytics' && <AnalyticsView key="analytics" />}
                        {activeTab === 'settings' && <SettingsView key="settings" />}
                    </AnimatePresence>
                </main>
            </div>

            {/* Mobile Bottom Navigation (Hidden on Desktop) */}
            <nav className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-around items-center px-4 py-2 bg-slate-900/90 backdrop-blur-xl w-[92%] mx-auto rounded-full border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]">
                <NavItems />
            </nav>
        </div>
    );
}

export default App;
