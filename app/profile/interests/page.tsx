"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Save, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface InterestData {
  goals: string[];
  goalImportance: number;
  successDefinition: string;
  sleepHours: number;
  sleepQuality: string;
  consistentSleep: boolean;
  eatingHabits: string;
  waterIntake: number;
  physicalActivity: string;
  stressLevel: string;
  relaxationFrequency: string;
  mindfulnessPractice: boolean;
  screenTime: number;
  mindlessScrolling: boolean;
  existingGoodHabits: string[];
  habitsToBreak: string[];
  obstacles: string[];
  disciplineLevel: number;
  peakProductivityTime: string;
  reminderPreference: string;
  habitApproach: string;
  dailyTimeCommitment: string;
  motivationFactors: string[];
}

const GOAL_OPTIONS = [
  'Weight Loss',
  'Muscle Gain',
  'Better Sleep',
  'Stress Management',
  'Productivity',
  'Mental Health',
  'Nutrition',
  'Hydration',
  'Exercise Routine',
  'Time Management'
];

const HABIT_OPTIONS = [
  'Early Morning Routine',
  'Regular Exercise',
  'Healthy Eating',
  'Reading',
  'Meditation',
  'Journaling',
  'Drinking Water',
  'Taking Breaks'
];

const BAD_HABIT_OPTIONS = [
  'Excessive Social Media',
  'Procrastination',
  'Late Night Snacking',
  'Skipping Meals',
  'Not Exercising',
  'Poor Sleep Schedule',
  'Negative Thinking',
  'Overworking'
];

const OBSTACLE_OPTIONS = [
  'Lack of Time',
  'Lack of Motivation',
  'Social Pressure',
  'Work Stress',
  'Family Commitments',
  'Financial Constraints',
  'Health Issues',
  'Lack of Knowledge'
];

const MOTIVATION_OPTIONS = [
  'Health Benefits',
  'Appearance',
  'Energy Levels',
  'Confidence',
  'Family',
  'Career',
  'Mental Clarity',
  'Long-term Goals'
];

export default function MyInterestsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState<InterestData>({
    goals: [],
    goalImportance: 3,
    successDefinition: "",
    sleepHours: 7,
    sleepQuality: "Good",
    consistentSleep: false,
    eatingHabits: "Balanced",
    waterIntake: 6,
    physicalActivity: "2-3 times",
    stressLevel: "Moderate",
    relaxationFrequency: "A few times a week",
    mindfulnessPractice: false,
    screenTime: 4,
    mindlessScrolling: false,
    existingGoodHabits: [],
    habitsToBreak: [],
    obstacles: [],
    disciplineLevel: 3,
    peakProductivityTime: "Morning",
    reminderPreference: "Push notifications",
    habitApproach: "Start small and build up gradually",
    dailyTimeCommitment: "15-30 mins",
    motivationFactors: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    fetchUserPreferences();
  }, [session]);

  const fetchUserPreferences = async () => {
    try {
      const response = await fetch("/api/user/preferences");
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
      setError("Failed to load your preferences");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    
    try {
      const response = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save preferences");
      }

      toast({
        title: "Success",
        description: "Your interests have been updated successfully!",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      setError("Failed to save your preferences. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleArrayToggle = (array: string[], value: string, setter: (newArray: string[]) => void) => {
    if (array.includes(value)) {
      setter(array.filter(item => item !== value));
    } else {
      setter([...array, value]);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Interests</h1>
          <p className="text-muted-foreground mt-2">
            Update your preferences and interests to get better recommendations
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {/* Goals & Motivation */}
        <Card>
          <CardHeader>
            <CardTitle>Goals & Motivation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-base font-medium">Primary Goals</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {GOAL_OPTIONS.map((goal) => (
                  <div key={goal} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal}
                      checked={formData.goals.includes(goal)}
                      onCheckedChange={() =>
                        handleArrayToggle(formData.goals, goal, (newGoals) =>
                          setFormData(prev => ({ ...prev, goals: newGoals }))
                        )
                      }
                    />
                    <Label htmlFor={goal} className="text-sm">{goal}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Goal Importance (1-5)</Label>
              <div className="px-3 py-2">
                <Slider
                  value={[formData.goalImportance]}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, goalImportance: value[0] }))}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>Not Important</span>
                  <span>Very Important</span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="success" className="text-base font-medium">How do you define success?</Label>
              <Textarea
                id="success"
                value={formData.successDefinition}
                onChange={(e) => setFormData(prev => ({ ...prev, successDefinition: e.target.value }))}
                placeholder="Describe what success means to you..."
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sleep & Health */}
        <Card>
          <CardHeader>
            <CardTitle>Sleep & Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-base font-medium">Sleep Hours: {formData.sleepHours}h</Label>
              <Slider
                value={[formData.sleepHours]}
                onValueChange={(value) => setFormData(prev => ({ ...prev, sleepHours: value[0] }))}
                max={12}
                min={4}
                step={0.5}
                className="w-full mt-2"
              />
            </div>

            <div>
              <Label className="text-base font-medium">Sleep Quality</Label>
              <Select
                value={formData.sleepQuality}
                onValueChange={(value) => setFormData(prev => ({ ...prev, sleepQuality: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Poor">Poor</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="consistent-sleep"
                checked={formData.consistentSleep}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consistentSleep: checked }))}
              />
              <Label htmlFor="consistent-sleep">I have a consistent sleep schedule</Label>
            </div>
          </CardContent>
        </Card>

        {/* Lifestyle & Habits */}
        <Card>
          <CardHeader>
            <CardTitle>Lifestyle & Habits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-base font-medium">Existing Good Habits</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {HABIT_OPTIONS.map((habit) => (
                  <div key={habit} className="flex items-center space-x-2">
                    <Checkbox
                      id={habit}
                      checked={formData.existingGoodHabits.includes(habit)}
                      onCheckedChange={() =>
                        handleArrayToggle(formData.existingGoodHabits, habit, (newHabits) =>
                          setFormData(prev => ({ ...prev, existingGoodHabits: newHabits }))
                        )
                      }
                    />
                    <Label htmlFor={habit} className="text-sm">{habit}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Habits to Break</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {BAD_HABIT_OPTIONS.map((habit) => (
                  <div key={habit} className="flex items-center space-x-2">
                    <Checkbox
                      id={`break-${habit}`}
                      checked={formData.habitsToBreak.includes(habit)}
                      onCheckedChange={() =>
                        handleArrayToggle(formData.habitsToBreak, habit, (newHabits) =>
                          setFormData(prev => ({ ...prev, habitsToBreak: newHabits }))
                        )
                      }
                    />
                    <Label htmlFor={`break-${habit}`} className="text-sm">{habit}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Common Obstacles</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {OBSTACLE_OPTIONS.map((obstacle) => (
                  <div key={obstacle} className="flex items-center space-x-2">
                    <Checkbox
                      id={obstacle}
                      checked={formData.obstacles.includes(obstacle)}
                      onCheckedChange={() =>
                        handleArrayToggle(formData.obstacles, obstacle, (newObstacles) =>
                          setFormData(prev => ({ ...prev, obstacles: newObstacles }))
                        )
                      }
                    />
                    <Label htmlFor={obstacle} className="text-sm">{obstacle}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-base font-medium">Peak Productivity Time</Label>
              <Select
                value={formData.peakProductivityTime}
                onValueChange={(value) => setFormData(prev => ({ ...prev, peakProductivityTime: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Early Morning">Early Morning (5-8 AM)</SelectItem>
                  <SelectItem value="Morning">Morning (8-11 AM)</SelectItem>
                  <SelectItem value="Afternoon">Afternoon (12-5 PM)</SelectItem>
                  <SelectItem value="Evening">Evening (5-8 PM)</SelectItem>
                  <SelectItem value="Night">Night (8-11 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-medium">Daily Time Commitment</Label>
              <Select
                value={formData.dailyTimeCommitment}
                onValueChange={(value) => setFormData(prev => ({ ...prev, dailyTimeCommitment: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5-15 mins">5-15 minutes</SelectItem>
                  <SelectItem value="15-30 mins">15-30 minutes</SelectItem>
                  <SelectItem value="30-60 mins">30-60 minutes</SelectItem>
                  <SelectItem value="1-2 hours">1-2 hours</SelectItem>
                  <SelectItem value="2+ hours">2+ hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-medium">Motivation Factors</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {MOTIVATION_OPTIONS.map((factor) => (
                  <div key={factor} className="flex items-center space-x-2">
                    <Checkbox
                      id={factor}
                      checked={formData.motivationFactors.includes(factor)}
                      onCheckedChange={() =>
                        handleArrayToggle(formData.motivationFactors, factor, (newFactors) =>
                          setFormData(prev => ({ ...prev, motivationFactors: newFactors }))
                        )
                      }
                    />
                    <Label htmlFor={factor} className="text-sm">{factor}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
