import mongoose from "mongoose";

const workoutLogSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    goalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RecommendedGoal",
      required: true,
      index: true,
    },
    activityName: {
      type: String,
      required: true,
    },
    dayIndex: {
      type: Number,
      required: true,
    },
    activityIndex: {
      type: Number,
      required: true,
    },
    amountLogged: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    isDailyTargetMet: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying of user's daily logs
workoutLogSchema.index({ userId: 1, date: 1 });

export const WorkoutLog = mongoose.models.WorkoutLog || mongoose.model("WorkoutLog", workoutLogSchema); 