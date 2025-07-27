import mongoose, { Schema, Document } from "mongoose";

export interface IRecommendedGoal extends Document {
  userId: string;
  title: string;
  description: string;
  category: "fitness" | "nutrition" | "mental_health" | "productivity" | "sleep" | "other";
  planDetails: {
    type: "workout" | "nutrition" | "mental" | "productivity" | "sleep" | "other";
    schedule: Array<{
      day: number;
      activities: Array<{
        name: string;
        description: string;
        duration?: number; // in minutes
        sets?: number;
        reps?: number;
        calories?: number;
        instructions?: string;
        targetValue: number;
        currentProgress: number;
        unit: string;
        isDailyTargetMet: boolean;
        lastUpdatedDate: Date;
      }>;
    }>;
    requirements?: {
      equipment?: string[];
      timeCommitment?: string;
      difficulty?: "beginner" | "intermediate" | "advanced";
      prerequisites?: string[];
    };
    tips?: string[];
    resources?: Array<{
      type: "video" | "article" | "app" | "other";
      title: string;
      url?: string;
      description?: string;
    }>;
  };
  isAccepted: boolean;
  status: "suggested" | "accepted" | "declined" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const RecommendedGoalSchema = new Schema<IRecommendedGoal>(
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
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["fitness", "nutrition", "mental_health", "productivity", "sleep", "other"],
    },
    planDetails: {
      type: {
        type: String,
        required: true,
        enum: ["workout", "nutrition", "mental", "productivity", "sleep", "other"],
      },
      schedule: [{
        day: {
          type: Number,
          required: true,
        },
        activities: [{
          name: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
          duration: Number,
          sets: Number,
          reps: Number,
          calories: Number,
          instructions: String,
          targetValue: {
            type: Number,
            required: true,
          },
          currentProgress: {
            type: Number,
            default: 0,
          },
          unit: {
            type: String,
            required: true,
          },
          isDailyTargetMet: {
            type: Boolean,
            default: false,
          },
          lastUpdatedDate: {
            type: Date,
            default: Date.now,
          },
        }],
      }],
      requirements: {
        equipment: [String],
        timeCommitment: String,
        difficulty: {
          type: String,
          enum: ["beginner", "intermediate", "advanced"],
        },
        prerequisites: [String],
      },
      tips: [String],
      resources: [{
        type: {
          type: String,
          enum: ["video", "article", "app", "other"],
        },
        title: String,
        url: String,
        description: String,
      }],
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      required: true,
      enum: ["suggested", "accepted", "declined", "completed"],
      default: "suggested",
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
RecommendedGoalSchema.index({ userId: 1, status: 1 });
RecommendedGoalSchema.index({ userId: 1, category: 1 });
RecommendedGoalSchema.index({ userId: 1, createdAt: -1 });

export const RecommendedGoal = mongoose.models.RecommendedGoal || 
  mongoose.model<IRecommendedGoal>("RecommendedGoal", RecommendedGoalSchema); 