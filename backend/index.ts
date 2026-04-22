import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();
const PORT:any = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.warn("MONGO_URI is not set. Skipping MongoDB connection for now.");
            return;
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Atlas Connected');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
    }
};

connectDB().then(() => {
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
});
