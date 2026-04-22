import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';
import { useStore } from '../store';

const AuthView = () => {
    const { login, register } = useStore();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        let success = false;
        
        if (isLogin) {
            success = await login(email, password);
        } else {
            if (!name) return setError('Name is required');
            success = await register(name, email, password);
        }

        if (!success) {
            setError(isLogin ? 'Invalid credentials' : 'Error creating account. Ensure email is unique.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tertiary/20 rounded-full blur-3xl opacity-50"></div>
            
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-8 rounded-3xl border border-white/10 w-full max-w-md relative z-10 shadow-2xl bg-surface-container-high/80 backdrop-blur-2xl">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-white shadow-[0_0_30px_rgba(186,158,255,0.3)]">
                        <LayoutDashboard size={32} />
                    </div>
                </div>
                <h2 className="text-3xl font-headline font-bold text-center text-white mb-2">
                    {isLogin ? 'Welcome Back' : 'Join Taskify'}
                </h2>
                <p className="text-center text-on-surface-variant mb-8 text-sm">
                    The ultimate productivity suite awaits.
                </p>

                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl mb-4 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 bg-surface-container-highest border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-200 focus:ring-1 focus:ring-primary outline-none" placeholder="Alex Chen" />
                        </div>
                    )}
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 bg-surface-container-highest border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-200 focus:ring-1 focus:ring-primary outline-none" placeholder="alex@example.com" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Password</label>
                        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full mt-1 bg-surface-container-highest border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-200 focus:ring-1 focus:ring-primary outline-none" placeholder="••••••••" />
                    </div>

                    <button type="submit" className="w-full py-4 mt-6 bg-gradient-to-r from-primary to-primary-container text-background font-bold rounded-xl active:scale-95 transition-transform">
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-slate-400 hover:text-white transition-colors">
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthView;
