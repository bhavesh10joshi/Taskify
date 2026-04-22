import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
    content: string;
    user: mongoose.Types.ObjectId;
}

const NoteSchema: Schema = new Schema({
    content: { type: String, default: "" },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model<INote>('Note', NoteSchema);
