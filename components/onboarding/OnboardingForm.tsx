"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { OnboardingSteps } from "./OnboardingSteps";
import { useRouter } from "next/navigation";

interface RecommendationGoal {
  _id?: string;
  title: string;
  category: 'fitness' | 'nutrition' | 'mental_health' | 'productivity' | 'sleep' | 'other';
  description: string;
  plan: string;
  reasoning?: string;
}

interface OnboardingFormProps {
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
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
  ageRange?: string;
  gender?: string;
  occupation?: string;
}

const TOTAL_STEPS = 7;

export function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
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
    motivationFactors: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationGoal[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Call the parent's onComplete function which handles saving and redirect
      await onComplete(formData);
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    // Save partial data when moving to next step
    try {
      await fetch('/api/onboarding/partial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    } catch (error) {
      console.error('Error saving partial data:', error);
    }
    setCurrentStep(prev => prev + 1);
  };
  
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const skipStep = async () => {
    // Save current partial data and skip to next step
    try {
      await fetch('/api/onboarding/partial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    } catch (error) {
      console.error('Error saving partial data:', error);
    }
    setCurrentStep(prev => prev + 1);
  };

  const skipToEnd = async () => {
    // Skip all remaining steps and complete onboarding
    try {
      setIsSubmitting(true);
      
      // Call the parent's onComplete function which handles saving and redirect
      await onComplete(formData);
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      setIsLoadingRecommendations(true);
      
      // First save the current form data
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      // Then fetch AI recommendations
      const response = await fetch('/api/recommended-goals/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      
      const data = await response.json();
      setRecommendations(data.goals || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Step {currentStep} of {TOTAL_STEPS}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <OnboardingSteps
                  step={currentStep}
                  formData={formData}
                  setFormData={setFormData}
                />
              </motion.div>
            </AnimatePresence>

            {/* AI Recommendations Display */}
            {recommendations.length > 0 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Your Personalized AI Recommendations</h3>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div key={rec._id || index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{rec.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          rec.category === 'fitness' ? 'bg-green-100 text-green-800' :
                          rec.category === 'nutrition' ? 'bg-orange-100 text-orange-800' :
                          rec.category === 'mental_health' ? 'bg-purple-100 text-purple-800' :
                          rec.category === 'productivity' ? 'bg-blue-100 text-blue-800' :
                          rec.category === 'sleep' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {rec.category.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{rec.description}</p>
                      <div className="text-sm">
                        <strong className="text-gray-700">Action Plan:</strong>
                        <p className="text-gray-600 mt-1">{rec.plan}</p>
                      </div>
                      {rec.reasoning && (
                        <div className="text-sm mt-2">
                          <strong className="text-gray-700">Why this works for you:</strong>
                          <p className="text-gray-600 mt-1">{rec.reasoning}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  💡 These recommendations are based on your onboarding responses. You can refine them in the next step!
                </p>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <div className="flex gap-2">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                  >
                    Previous
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                {currentStep < TOTAL_STEPS ? (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={skipStep}
                      className="text-muted-foreground"
                    >
                      Skip
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                    >
                      Next
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={skipToEnd}
                      disabled={isSubmitting}
                      className="text-muted-foreground"
                    >
                      Skip All
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={fetchRecommendations}
                      disabled={isLoadingRecommendations}
                      className="mr-2"
                    >
                      {isLoadingRecommendations ? 'Getting Recommendations...' : '✨ Get AI Recommendations'}
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 