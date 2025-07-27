"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { OnboardingData } from "./OnboardingForm";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface OnboardingStepsProps {
  step: number;
  formData: OnboardingData;
  setFormData: (data: OnboardingData) => void;
}

export const goalOptions = [
  "Improve physical health",
  "Enhance mental well-being",
  "Boost productivity",
  "Improve relationships",
  "Financial stability",
  "Better sleep",
  "More energy",
  "Develop a new skill/hobby",
];

export const sleepQualityOptions = ["Poor", "Fair", "Good", "Excellent"];
export const eatingHabitOptions = ["Balanced", "Mostly healthy", "Occasionally unhealthy", "Very unhealthy"];
export const physicalActivityOptions = ["0-1 times", "2-3 times", "4-5 times", "6+ times"];
export const stressLevelOptions = ["Low", "Moderate", "High"];
export const relaxationFrequencyOptions = ["Daily", "A few times a week", "Rarely", "Never"];
export const obstacleOptions = [
  "Lack of time",
  "Lack of motivation",
  "Forgetting",
  "Feeling overwhelmed",
  "Procrastination",
  "Lack of support",
  "Don't know where to start",
];
export const peakTimeOptions = ["Morning", "Afternoon", "Evening", "Night"];
export const reminderOptions = ["Push notifications", "Email", "In-app visual cues"];
export const habitApproachOptions = [
  "Start small and build up gradually",
  "Go all-in and try to change quickly",
  "Focus on one habit at a time",
  "Work on multiple habits simultaneously",
];
export const timeCommitmentOptions = ["5-10 mins", "15-30 mins", "30-60 mins", "1+ hour"];
export const motivationOptions = [
  "Seeing progress",
  "Rewards",
  "Accountability",
  "Positive affirmations",
  "Avoiding negative consequences",
];
export const ageRangeOptions = ["18-24", "25-34", "35-44", "45-54", "55+"];
export const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say"];
export const occupationOptions = ["Student", "Office worker", "Manual labor", "Stay-at-home", "Retired"];

const activityLevels = [
  { value: "sedentary", label: "Sedentary (little or no exercise)" },
  { value: "lightly_active", label: "Lightly Active (light exercise 1-3 days/week)" },
  { value: "moderately_active", label: "Moderately Active (moderate exercise 3-5 days/week)" },
  { value: "very_active", label: "Very Active (hard exercise 6-7 days/week)" },
  { value: "extremely_active", label: "Extremely Active (very hard exercise & physical job)" },
];

const dietaryPreferences = [
  { value: "omnivore", label: "Omnivore" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "pescatarian", label: "Pescatarian" },
  { value: "keto", label: "Keto" },
  { value: "paleo", label: "Paleo" },
  { value: "mediterranean", label: "Mediterranean" },
];

const fitnessExperienceLevels = [
  { value: "beginner", label: "Beginner (0-6 months)" },
  { value: "intermediate", label: "Intermediate (6 months - 2 years)" },
  { value: "advanced", label: "Advanced (2-5 years)" },
  { value: "expert", label: "Expert (5+ years)" },
];

const workoutTypes = [
  "Strength Training",
  "Cardio",
  "Yoga",
  "HIIT",
  "Pilates",
  "CrossFit",
  "Swimming",
  "Cycling",
  "Running",
  "Dancing",
  "Martial Arts",
  "Team Sports",
];

const commonHealthConditions = [
  "Hypertension",
  "Diabetes",
  "Asthma",
  "Arthritis",
  "Heart Disease",
  "Thyroid Disorder",
  "Anxiety",
  "Depression",
  "Back Pain",
  "Joint Pain",
];

const commonAllergies = [
  "Peanuts",
  "Tree Nuts",
  "Milk",
  "Eggs",
  "Soy",
  "Wheat",
  "Fish",
  "Shellfish",
  "Gluten",
  "Lactose",
];

export function OnboardingSteps({ step, formData, setFormData }: OnboardingStepsProps) {
  switch (step) {
    case 1:
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>What are your primary goals? (Select all that apply)</Label>
            <div className="grid gap-2">
              {goalOptions.map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={goal}
                    checked={formData.goals.includes(goal)}
                    onCheckedChange={(checked) => {
                      setFormData({
                        ...formData,
                        goals: checked
                          ? [...formData.goals, goal]
                          : formData.goals.filter(g => g !== goal)
                      });
                    }}
                  />
                  <Label htmlFor={goal}>{goal}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>How important is this goal to you? (1-5)</Label>
            <Slider
              value={[formData.goalImportance]}
              onValueChange={([value]) => setFormData({ ...formData, goalImportance: value })}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Not very</span>
              <span>Extremely</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="successDefinition">What does success look like for you?</Label>
            <Textarea
              id="successDefinition"
              value={formData.successDefinition}
              onChange={(e) => setFormData({ ...formData, successDefinition: e.target.value })}
              placeholder="Describe what success means to you..."
            />
          </div>
        </div>
      );

    case 2:
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Sleep Habits</Label>
            <div className="space-y-2">
              <Label>Average hours of sleep per night</Label>
              <Slider
                value={[formData.sleepHours]}
                onValueChange={([value]) => setFormData({ ...formData, sleepHours: value })}
                min={4}
                max={12}
                step={0.5}
                className="w-full"
              />
              <div className="text-center text-sm text-muted-foreground">
                {formData.sleepHours} hours
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sleep Quality</Label>
              <Select
                value={formData.sleepQuality}
                onValueChange={(value) => setFormData({ ...formData, sleepQuality: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sleep quality" />
                </SelectTrigger>
                <SelectContent>
                  {sleepQualityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="consistentSleep"
                checked={formData.consistentSleep}
                onCheckedChange={(checked) => setFormData({ ...formData, consistentSleep: checked as boolean })}
              />
              <Label htmlFor="consistentSleep">Do you have a consistent bedtime/wake-up routine?</Label>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Nutrition & Diet</Label>
            <div className="space-y-2">
              <Label>Current Eating Habits</Label>
              <Select
                value={formData.eatingHabits}
                onValueChange={(value) => setFormData({ ...formData, eatingHabits: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select eating habits" />
                </SelectTrigger>
                <SelectContent>
                  {eatingHabitOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Physical Activity</Label>
            <div className="space-y-2">
              <Label>Weekly Exercise Frequency</Label>
              <Select
                value={formData.physicalActivity}
                onValueChange={(value) => setFormData({ ...formData, physicalActivity: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {physicalActivityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Stress & Mental Well-being</Label>
            <div className="space-y-2">
              <Label>Typical Stress Level</Label>
              <Select
                value={formData.stressLevel}
                onValueChange={(value) => setFormData({ ...formData, stressLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stress level" />
                </SelectTrigger>
                <SelectContent>
                  {stressLevelOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Relaxation Frequency</Label>
              <Select
                value={formData.relaxationFrequency}
                onValueChange={(value) => setFormData({ ...formData, relaxationFrequency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {relaxationFrequencyOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="mindfulnessPractice"
                checked={formData.mindfulnessPractice}
                onCheckedChange={(checked) => setFormData({ ...formData, mindfulnessPractice: checked as boolean })}
              />
              <Label htmlFor="mindfulnessPractice">Do you practice mindfulness or meditation?</Label>
            </div>
          </div>
        </div>
      );

    case 4:
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Screen Time & Digital Habits</Label>
            <div className="space-y-2">
              <Label>Daily Screen Time (hours)</Label>
              <Slider
                value={[formData.screenTime]}
                onValueChange={([value]) => setFormData({ ...formData, screenTime: value })}
                min={0}
                max={12}
                step={0.5}
                className="w-full"
              />
              <div className="text-center text-sm text-muted-foreground">
                {formData.screenTime} hours
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="mindlessScrolling"
                checked={formData.mindlessScrolling}
                onCheckedChange={(checked) => setFormData({ ...formData, mindlessScrolling: checked as boolean })}
              />
              <Label htmlFor="mindlessScrolling">Do you find yourself mindlessly scrolling?</Label>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Existing Habits</Label>
            <div className="space-y-2">
              <Label>Positive habits you already practice</Label>
              <Textarea
                value={formData.existingGoodHabits.join(', ')}
                onChange={(e) => setFormData({ ...formData, existingGoodHabits: e.target.value.split(',').map(h => h.trim()) })}
                placeholder="Enter habits separated by commas..."
              />
            </div>

            <div className="space-y-2">
              <Label>Habits you'd like to break</Label>
              <Textarea
                value={formData.habitsToBreak.join(', ')}
                onChange={(e) => setFormData({ ...formData, habitsToBreak: e.target.value.split(',').map(h => h.trim()) })}
                placeholder="Enter habits separated by commas..."
              />
            </div>
          </div>
        </div>
      );

    case 5:
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Challenges & Obstacles</Label>
            <div className="grid gap-2">
              {obstacleOptions.map((obstacle) => (
                <div key={obstacle} className="flex items-center space-x-2">
                  <Checkbox
                    id={obstacle}
                    checked={formData.obstacles.includes(obstacle)}
                    onCheckedChange={(checked) => {
                      setFormData({
                        ...formData,
                        obstacles: checked
                          ? [...formData.obstacles, obstacle]
                          : formData.obstacles.filter(o => o !== obstacle)
                      });
                    }}
                  />
                  <Label htmlFor={obstacle}>{obstacle}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>How disciplined would you rate yourself? (1-5)</Label>
            <Slider
              value={[formData.disciplineLevel]}
              onValueChange={([value]) => setFormData({ ...formData, disciplineLevel: value })}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Not at all</span>
              <span>Very disciplined</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Peak Productivity Time</Label>
            <Select
              value={formData.peakProductivityTime}
              onValueChange={(value) => setFormData({ ...formData, peakProductivityTime: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {peakTimeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 6:
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Preferences & Customization</Label>
            <div className="space-y-2">
              <Label>Reminder Preference</Label>
              <Select
                value={formData.reminderPreference}
                onValueChange={(value) => setFormData({ ...formData, reminderPreference: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  {reminderOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Preferred Approach</Label>
              <Select
                value={formData.habitApproach}
                onValueChange={(value) => setFormData({ ...formData, habitApproach: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select approach" />
                </SelectTrigger>
                <SelectContent>
                  {habitApproachOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Daily Time Commitment</Label>
              <Select
                value={formData.dailyTimeCommitment}
                onValueChange={(value) => setFormData({ ...formData, dailyTimeCommitment: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time commitment" />
                </SelectTrigger>
                <SelectContent>
                  {timeCommitmentOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>What motivates you most? (Select all that apply)</Label>
              <div className="grid gap-2">
                {motivationOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={formData.motivationFactors.includes(option)}
                      onCheckedChange={(checked) => {
                        setFormData({
                          ...formData,
                          motivationFactors: checked
                            ? [...formData.motivationFactors, option]
                            : formData.motivationFactors.filter(m => m !== option)
                        });
                      }}
                    />
                    <Label htmlFor={option}>{option}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    case 7:
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Basic Information (Optional)</Label>
            <div className="space-y-2">
              <Label>Age Range</Label>
              <Select
                value={formData.ageRange}
                onValueChange={(value) => setFormData({ ...formData, ageRange: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select age range" />
                </SelectTrigger>
                <SelectContent>
                  {ageRangeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Occupation Type</Label>
              <Select
                value={formData.occupation}
                onValueChange={(value) => setFormData({ ...formData, occupation: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select occupation" />
                </SelectTrigger>
                <SelectContent>
                  {occupationOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
} 