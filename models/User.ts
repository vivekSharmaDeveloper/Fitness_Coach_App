import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  image: String,
  emailVerified: Date,
  onboardingCompleted: {
    type: Boolean,
    default: false,
  },
  // Onboarding data
  goals: [String],
  goalImportance: Number,
  successDefinition: String,
  sleepHours: Number,
  sleepQuality: String,
  consistentSleep: Boolean,
  eatingHabits: String,
  waterIntake: Number,
  physicalActivity: String,
  stressLevel: String,
  relaxationFrequency: String,
  mindfulnessPractice: Boolean,
  screenTime: Number,
  mindlessScrolling: Boolean,
  existingGoodHabits: [String],
  habitsToBreak: [String],
  obstacles: [String],
  disciplineLevel: Number,
  peakProductivityTime: String,
  reminderPreference: String,
  habitApproach: String,
  dailyTimeCommitment: String,
  motivationFactors: [String],
  ageRange: String,
  gender: String,
  occupation: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const User = mongoose.models.User || mongoose.model('User', userSchema); 