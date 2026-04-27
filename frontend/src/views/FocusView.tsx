import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, SkipForward, Flower2, Sprout, TreeDeciduous, TreePine } from 'lucide-react';

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function FocusView() {
    const [mode, setMode] = useState<'stopwatch' | 'pomodoro'>('pomodoro');
    const [pomoState, setPomoState] = useState<'focus' | 'break'>('focus');
    const [isActive, setIsActive] = useState(false);
    
    // Stopwatch: seconds elapsed
    const [elapsed, setElapsed] = useState(0);
    
    // Pomodoro: seconds remaining
    const [pomoTimeLeft, setPomoTimeLeft] = useState(FOCUS_TIME);
    
    // Target time in minutes
    const [targetMinutes, setTargetMinutes] = useState(120);
    
    // Total focused time (across both modes)
    const [totalFocusedSeconds, setTotalFocusedSeconds] = useState(0);

    // Timer Logic
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        
        if (isActive) {
            interval = setInterval(() => {
                if (mode === 'stopwatch') {
                    setElapsed(prev => prev + 1);
                    setTotalFocusedSeconds(prev => prev + 1);
                } else if (mode === 'pomodoro') {
                    setPomoTimeLeft(prev => {
                        if (prev <= 1) {
                            // Timer finished
                            handleSkip(); 
                            return 0; // Temporarily 0, handleSkip will reset
                        }
                        return prev - 1;
                    });
                    
                    if (pomoState === 'focus') {
                        setTotalFocusedSeconds(prev => prev + 1);
                    }
                }
            }, 1000);
        }
        
        return () => clearInterval(interval);
    }, [isActive, mode, pomoState]);

    const toggleTimer = () => setIsActive(!isActive);

    const handleStop = () => {
        setIsActive(false);
        if (mode === 'stopwatch') {
            setElapsed(0);
        } else {
            setPomoTimeLeft(pomoState === 'focus' ? FOCUS_TIME : BREAK_TIME);
        }
    };

    const handleSkip = () => {
        if (mode === 'pomodoro') {
            if (pomoState === 'focus') {
                setPomoState('break');
                setPomoTimeLeft(BREAK_TIME);
            } else {
                setPomoState('focus');
                setPomoTimeLeft(FOCUS_TIME);
            }
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Calculate progress (max 100%)
    const progressPercent = Math.min((totalFocusedSeconds / (targetMinutes * 60)) * 100, 100);

    // Render plant based on progress
    const renderPlant = () => {
        if (progressPercent < 25) return <Sprout size={80} className="text-green-500" />;
        if (progressPercent < 50) return <Flower2 size={90} className="text-green-400" />;
        if (progressPercent < 75) return <TreeDeciduous size={100} className="text-green-300" />;
        return <TreePine size={110} className="text-emerald-400" />;
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col h-full gap-6"
        >
            <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Focus Mode</h2>
                    <p className="text-slate-400 text-sm">Grow your plant by staying focused.</p>
                </div>
                
                <div className="flex items-center gap-4 bg-black/20 p-2 rounded-xl border border-white/5">
                    <button 
                        onClick={() => { setMode('pomodoro'); setIsActive(false); }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'pomodoro' ? 'bg-[#ba9eff] text-white shadow-[0_0_15px_rgba(186,158,255,0.3)]' : 'text-slate-400 hover:text-white'}`}
                    >
                        Pomodoro
                    </button>
                    <button 
                        onClick={() => { setMode('stopwatch'); setIsActive(false); }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'stopwatch' ? 'bg-[#ba9eff] text-white shadow-[0_0_15px_rgba(186,158,255,0.3)]' : 'text-slate-400 hover:text-white'}`}
                    >
                        Stopwatch
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                {/* Timer Section */}
                <div className="lg:col-span-2 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
                    
                    {/* Background glow based on state */}
                    <div className={`absolute inset-0 opacity-20 blur-[100px] transition-colors duration-1000 ${
                        mode === 'pomodoro' && pomoState === 'break' ? 'bg-blue-500' : 'bg-[#ba9eff]'
                    }`} />

                    <div className="relative z-10 flex flex-col items-center">
                        {mode === 'pomodoro' && (
                            <span className={`px-4 py-1.5 rounded-full text-sm font-medium mb-6 ${pomoState === 'focus' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
                                {pomoState === 'focus' ? 'Focus Time' : 'Break Time'}
                            </span>
                        )}
                        
                        <div className="text-[100px] leading-none font-bold text-white mb-12 tracking-tight font-mono">
                            {mode === 'stopwatch' ? formatTime(elapsed) : formatTime(pomoTimeLeft)}
                        </div>

                        <div className="flex items-center gap-6">
                            <button 
                                onClick={handleStop}
                                className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all hover:scale-105 active:scale-95"
                            >
                                <Square size={20} fill="currentColor" />
                            </button>
                            
                            <button 
                                onClick={toggleTimer}
                                className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#ba9eff] to-[#ae8dff] text-white shadow-[0_0_30px_rgba(186,158,255,0.4)] transition-all hover:scale-105 active:scale-95"
                            >
                                {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-2" />}
                            </button>
                            
                            {mode === 'pomodoro' ? (
                                <button 
                                    onClick={handleSkip}
                                    className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all hover:scale-105 active:scale-95"
                                >
                                    <SkipForward size={20} />
                                </button>
                            ) : (
                                <div className="w-14 h-14" /> /* Placeholder to keep play button centered */
                            )}
                        </div>
                    </div>
                </div>

                {/* Plant Visualizer Section */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-white mb-2">Growth Target</h3>
                        <div className="flex items-center gap-3">
                            <input 
                                type="number" 
                                value={targetMinutes}
                                onChange={(e) => setTargetMinutes(Math.max(1, parseInt(e.target.value) || 60))}
                                className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white w-20 text-center outline-none focus:border-[#ba9eff] transition-colors"
                            />
                            <span className="text-slate-400 text-sm">minutes</span>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center relative min-h-[300px]">
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-green-500/10 to-transparent pointer-events-none rounded-b-xl" />
                        
                        <div className="text-slate-400 text-sm absolute top-0 text-center w-full">
                            Progress: {progressPercent.toFixed(1)}%
                        </div>
                        
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={Math.floor(progressPercent / 25)}
                                initial={{ scale: 0, opacity: 0, rotate: -10 }}
                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                exit={{ scale: 0, opacity: 0, rotate: 10 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                className="relative z-10"
                            >
                                {renderPlant()}
                            </motion.div>
                        </AnimatePresence>
                        
                        {/* Ground/Dirt line */}
                        <div className="w-48 h-2 bg-gradient-to-r from-transparent via-[#8b5a2b] to-transparent mt-4 rounded-full opacity-50" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
