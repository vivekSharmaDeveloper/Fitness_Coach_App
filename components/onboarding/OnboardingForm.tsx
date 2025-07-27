"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { OnboardingSteps } from "./OnboardingSteps";
import { useRouter } from "next/navigation";

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

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save onboarding data");
      }

      // Redirect to SMART goal definition page
      router.push("/goals/define-smart");
    } catch (error) {
      console.error("Error saving onboarding data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);
  
  const handleSkip = () => {
    router.push('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Step {currentStep} of {TOTAL_STEPS}</CardTitle>
            <Button
              type="button"
              variant="ghost"
              onClick={handleSkip}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Skip for now
            </Button>
          </div>
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
                      variant="outline"
                      onClick={handleSkip}
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
                      variant="outline"
                      onClick={handleSkip}
                    >
                      Skip
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Completing...' : 'Complete'}
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