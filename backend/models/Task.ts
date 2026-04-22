import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
    title: string;
    isCompleted: boolean;
    date: Date; // e.g. for "Tomorrow"
    isRecurring: boolean;
    streak: number; // Current streak for recurring task
    lastCompletedAt?: Date;
    goalId?: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
}

const TaskSchema: Schema = new Schema({
    title: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    date: { type: Date, required: true },
    isRecurring: { type: Boolean, default: false },
    streak: { type: Number, default: 0 },
    lastCompletedAt: { type: Date },
    goalId: { type: Schema.Types.ObjectId, ref: 'Goal' },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model<ITask>('Task', TaskSchema);
