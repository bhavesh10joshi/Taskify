import { create } from 'zustand';
import axios from 'axios';
import { API_BASE_URL } from './config';

// Configure Axios Defaults
if (API_BASE_URL) {
    axios.defaults.baseURL = API_BASE_URL;
}

// Configure Axios Interceptor to auto-attach token
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

interface State {
    user: any;
    token: string | null;
    tasks: any[];
    goals: any[];
    note: any;
    dailyQuote: string | null;
    
    // Auth actions
    register: (name: string, email: string, pass: string) => Promise<boolean>;
    login: (email: string, pass: string) => Promise<boolean>;
    logout: () => void;

    // Data actions
    fetchInsights: () => Promise<void>;
    fetchDailyQuote: () => Promise<void>;
    copyTasksToTomorrow: () => Promise<void>;
    addTask: (title: string, date: Date, goalId?: string) => Promise<void>;
    toggleTask: (id: string, isCompleted: boolean) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    updateNote: (content: string) => Promise<void>;
    
    addGoal: (title: string, targetValue: number) => Promise<void>;
    deleteGoal: (id: string) => Promise<void>;
    updateGoalProgress: (id: string, currentValue: number) => Promise<void>;
    updateMonthlyGoalsText: (text: string) => Promise<void>;
}

export const useStore = create<State>((set, get) => ({
    user: null,
    token: localStorage.getItem('token'),
    tasks: [],
    goals: [],
    note: { content: '' },
    dailyQuote: null,

    register: async (name, email, password) => {
        try {
            const res = await axios.post('/api/auth/register', { name, email, password });
            localStorage.setItem('token', res.data.token);
            set({ user: res.data, token: res.data.token });
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    },

    login: async (email, password) => {
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            set({ user: res.data, token: res.data.token });
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, tasks: [], goals: [], note: { content: '' } });
    },

    fetchInsights: async () => {
        if (!get().token) return;
        try {
            const res = await axios.get('/api/insights');
            if (res.data.user) {
                set({
                    user: res.data.user,
                    tasks: res.data.tasks || [],
                    goals: res.data.goals || [],
                    note: res.data.note || get().note
                });
            }
        } catch (e: any) {
            if (e.response?.status === 401) {
                get().logout();
            }
        }
    },
    fetchDailyQuote: async () => {
        try {
            const res = await axios.get('/api/openai/quote');
            set({ dailyQuote: res.data.quote });
        } catch (e) { console.error("Failed to fetch quote", e); }
    },
    copyTasksToTomorrow: async () => {
        const { tasks, addTask } = get();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const taskDate = (dateStr: any) => {
            const d = new Date(dateStr || new Date());
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        };

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const todayTasks = tasks.filter(t => {
            const td = taskDate(t.date);
            return td === today.getTime() || (td < today.getTime() && !t.isCompleted);
        });

        // Duplicate the tasks to tomorrow
        for (const task of todayTasks) {
            await addTask(task.title, tomorrow, task.goalId);
        }
    },
    addTask: async (title, date, goalId) => {
        try {
            const payload: any = { title, date, isCompleted: false };
            if (goalId) payload.goalId = goalId;
            const res = await axios.post('/api/tasks', payload);
            set({ tasks: [...get().tasks, res.data] });
        } catch(e) { console.error(e); }
    },
    toggleTask: async (id, isCompleted) => {
        try {
            const tasks = get().tasks.map(t => t._id === id ? { ...t, isCompleted } : t);
            set({ tasks });
            await axios.put(`/api/tasks/${id}`, { isCompleted });
        } catch(e) {}
    },
    deleteTask: async (id) => {
        try {
            const tasks = get().tasks.filter(t => t._id !== id);
            set({ tasks });
            await axios.delete(`/api/tasks/${id}`);
        } catch (e) {}
    },
    updateNote: async (content) => {
        set({ note: { content } });
        try {
            await axios.put('/api/notes', { content });
        } catch(e){}
    },
    addGoal: async (title, targetValue) => {
        try {
            const res = await axios.post('/api/goals', { title, targetValue, currentValue: 0 });
            set({ goals: [...get().goals, res.data] });
        } catch(e){}
    },
    deleteGoal: async (id) => {
        try {
            set({ goals: get().goals.filter(g => g._id !== id) });
            await axios.delete(`/api/goals/${id}`);
        } catch(e){}
    },
    updateGoalProgress: async (id, currentValue) => {
        try {
            set({ goals: get().goals.map(g => g._id === id ? { ...g, currentValue } : g) });
            await axios.put(`/api/goals/${id}`, { currentValue });
        } catch(e){}
    },
    updateMonthlyGoalsText: async (text) => {
        try {
            set({ user: { ...get().user, monthlyGoalsText: text } });
            await axios.put('/api/user', { monthlyGoalsText: text });
        } catch(e){}
    }
}));

