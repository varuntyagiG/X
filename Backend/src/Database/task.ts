import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  content: string;
  completed: boolean;
  createdAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model<ITask>("Task", TaskSchema);
