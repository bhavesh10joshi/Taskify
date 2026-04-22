import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string; // Optional because we might project it out
    monthlyGoalsText: string;
    preferences: {
        darkMode: boolean;
        streakGoal: number;
    };
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    monthlyGoalsText: { type: String, default: "" },
    preferences: {
        darkMode: { type: Boolean, default: true },
        streakGoal: { type: Number, default: 7 }
    }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
