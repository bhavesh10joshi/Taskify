import { Router } from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import OpenAI from 'openai';

const router = Router();

// We will initialize the OpenAI client only when needed so the server 
// doesn't crash on startup if OPENAI_API_KEY is not set yet.
const getOpenAIClient = () => {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is not configured in the environment.");
    }
    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
};

router.get('/quote', protect, async (req: AuthRequest, res) => {
    try {
        const openai = getOpenAIClient();
        
        // Generate a quote in Hindi or English
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Using a faster/cheaper model if available, fallback to 3.5 turbo
            messages: [
                {
                    role: "system",
                    content: "You are an inspiring assistant. Produce a single short motivational quote to help the user start their day with high energy and focus. The quote should randomly be either in English or Hindi (written in Devanagari script). Do not include any explanations or quotes marks, just the quote itself."
                }
            ],
            temperature: 0.9,
            max_tokens: 100,
        });

        const quote = response.choices[0].message?.content?.trim() || "Stay focused and never give up!";
        res.json({ quote });
    } catch (error: any) {
        console.error("OpenAI Quote Error:", error.message);
        // Fallback quote if API fails
        res.json({ quote: "Every day is a fresh start. Keep pushing forward!" });
    }
});

router.post('/chat', protect, async (req: AuthRequest, res) => {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
    }

    try {
        const openai = getOpenAIClient();
        
        const systemPrompt = {
            role: "system",
            content: "You are an integrated productivity assistant inside the 'Taskify' app. You help the user manage their tasks, targets, schedule, and maintain motivation. Be concise, energetic, and helpful."
        };

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [systemPrompt, ...messages],
            temperature: 0.7,
            max_tokens: 300,
        });

        const reply = response.choices[0].message;
        res.json({ reply });
    } catch (error: any) {
        console.error("OpenAI Chat Error:", error.message);
        res.status(500).json({ error: "Failed to communicate with AI assistant." });
    }
});

export default router;
