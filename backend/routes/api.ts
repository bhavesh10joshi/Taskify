import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Task from '../models/Task';
import Goal from '../models/Goal';
import Note from '../models/Note';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};

// --- HEALTH ROUTE ---
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- AUTH ROUTER ---
router.post('/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ error: 'User already exists' });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({
            _id: user._id, name: user.name, email: user.email, token: generateToken(user._id.toString())
        });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password || ''))) {
            res.json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id.toString()) });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- PROTECTED ROUTES ---

// Insights Dashboard Data
router.get('/insights', protect, async (req: AuthRequest, res) => {
    try {
        const user = await User.findById(req.user?.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        const tasks = await Task.find({ user: user._id }); 
        const goals = await Goal.find({ user: user._id });
        let note = await Note.findOne({ user: user._id });
        
        if (!note) {
            note = await Note.create({ user: user._id, content: '' });
        }

        res.json({ user, tasks, goals, note });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// User
router.put('/user', protect, async (req: AuthRequest, res) => {
    const user = await User.findById(req.user?.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    if (req.body.monthlyGoalsText !== undefined) {
        user.monthlyGoalsText = req.body.monthlyGoalsText;
    }
    await user.save();
    res.json(user);
});

// Tasks
router.post('/tasks', protect, async (req: AuthRequest, res) => {
    const task = await Task.create({ ...req.body, user: req.user?.id });
    res.json(task);
});

router.put('/tasks/:id', protect, async (req: AuthRequest, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
});

router.delete('/tasks/:id', protect, async (req: AuthRequest, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

// Goals
router.post('/goals', protect, async (req: AuthRequest, res) => {
    const d = new Date();
    const payload = { ...req.body, user: req.user?.id, month: d.getMonth(), year: d.getFullYear() };
    const goal = await Goal.create(payload);
    res.json(goal);
});

router.delete('/goals/:id', protect, async (req: AuthRequest, res) => {
    await Goal.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

router.put('/goals/:id', protect, async (req: AuthRequest, res) => {
    const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(goal);
});

// Notes
router.put('/notes', protect, async (req: AuthRequest, res) => {
    let note = await Note.findOne({ user: req.user?.id });
    if (note) {
        note.content = req.body.content;
        await note.save();
    } else {
        note = await Note.create({ user: req.user?.id, content: req.body.content });
    }
    res.json(note);
});

export default router;
