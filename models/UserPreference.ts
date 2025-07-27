import mongoose from 'mongoose';

const userPreferenceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  // Demographics
  age: Number,
  gender: String,
  
  // Biometrics
  height: Number, // in cm
  weight: Number, // in kg
  bodyFatPercentage: Number,
  activityLevel: {
    type: String,
    enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'],
  },
  
  // Health Information
  healthConditions: [String],
  allergies: [String],
  medications: [String],
  
  // Dietary Preferences
  dietaryPreferences: {
    type: [String],
    enum: ['omnivore', 'vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo', 'mediterranean'],
  },
  foodAllergies: [String],
  dietaryRestrictions: [String],
  
  // Fitness Experience
  fitnessExperience: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
  },
  preferredWorkoutTypes: [String],
  workoutFrequency: Number, // times per week
  workoutDuration: Number, // minutes per session
  
  // Step 1: Goals and Preferences
  goals: [String],
  goalImportance: Number,
  successDefinition: String,
  
  // Step 2: Sleep and Nutrition
  sleepHours: Number,
  sleepQuality: String,
  eatingHabits: String,
  waterIntake: Number, // liters per day
  
  // Step 3: Physical Activity and Mental Well-being
  physicalActivity: String,
  stressLevel: Number,
  mindfulnessPractice: Boolean,
  
  // Step 4: Digital Habits and Existing Routines
  screenTime: Number,
  existingRoutines: [String],
  
  // Step 5: Challenges and Productivity
  challenges: [String],
  productivityLevel: Number,
  
  // Step 6: Preferences and Motivation
  preferredWorkoutTime: String,
  motivationLevel: Number,
  
  // Additional Health Metrics
  restingHeartRate: Number,
  bloodPressure: {
    systolic: Number,
    diastolic: Number,
  },
  sleepQuality: {
    type: String,
    enum: ['poor', 'fair', 'good', 'excellent'],
  },
  
  // Lifestyle Factors
  smokingStatus: {
    type: String,
    enum: ['never', 'former', 'current'],
  },
  alcoholConsumption: {
    type: String,
    enum: ['none', 'occasional', 'moderate', 'heavy'],
  },
  
  // Metadata
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
userPreferenceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const UserPreference = mongoose.models.UserPreference || mongoose.model('UserPreference', userPreferenceSchema); 