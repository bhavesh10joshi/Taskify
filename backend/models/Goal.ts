import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
    title: string;
    targetValue: number;
    currentValue: number;
    month: number;
    year: number;
    user: mongoose.Types.ObjectId;
}

const GoalSchema: Schema = new Schema({
    title: { type: String, required: true },
    targetValue: { type: Number, required: true, default: 100 },
    currentValue: { type: Number, default: 0 },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model<IGoal>('Goal', GoalSchema);
