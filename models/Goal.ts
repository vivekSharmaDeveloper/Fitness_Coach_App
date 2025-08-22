import mongoose, { Schema, Document } from "mongoose";

export interface IGoal extends Document {
  userId: string;
  title: string;
  category: "fitness" | "nutrition" | "mental_health" | "productivity" | "sleep" | "other";
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  startDate: Date;
  endDate: Date;
  targetValue: number;
  unit: string;
  motivation?: string;
  potentialObstacles?: string;
  strategies?: string;
  notes?: string;
  currentProgress: number;
  status: "not_started" | "in_progress" | "completed" | "abandoned";
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema = new Schema<IGoal>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["fitness", "nutrition", "mental_health", "productivity", "sleep", "other"],
    },
    specific: {
      type: String,
      required: true,
    },
    measurable: {
      type: String,
      required: true,
    },
    achievable: {
      type: String,
      required: true,
    },
    relevant: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    targetValue: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    motivation: {
      type: String,
    },
    potentialObstacles: {
      type: String,
    },
    strategies: {
      type: String,
    },
    notes: {
      type: String,
    },
    currentProgress: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["not_started", "in_progress", "completed", "abandoned"],
      default: "not_started",
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
GoalSchema.index({ userId: 1, createdAt: -1 });
GoalSchema.index({ userId: 1, status: 1 });

export const Goal = mongoose.models.Goal || mongoose.model<IGoal>("Goal", GoalSchema); 