import mongoose, { Schema, Document } from "mongoose";

export interface IProgress extends Document {
  userId: string;
  goalId: string;
  date: Date;
  value: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    goalId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound indexes for better query performance
ProgressSchema.index({ userId: 1, goalId: 1, date: -1 });
ProgressSchema.index({ userId: 1, date: -1 });

export const Progress = mongoose.models.Progress || mongoose.model<IProgress>("Progress", ProgressSchema);
