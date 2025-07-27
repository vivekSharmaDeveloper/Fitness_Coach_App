"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, X, Check, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RecommendedGoalCardProps {
  goal: {
    _id: string;
    title: string;
    description: string;
    category: string;
    planDetails: {
      type: string;
      requirements?: {
        difficulty?: string;
        timeCommitment?: string;
      };
    };
    status: "suggested" | "accepted" | "declined" | "completed";
  };
}

const categoryLabels = {
  fitness: "Fitness",
  nutrition: "Nutrition",
  mental_health: "Mental Health",
  productivity: "Productivity",
  sleep: "Sleep",
  other: "Other",
};

const difficultyColors = {
  beginner: "bg-green-500",
  intermediate: "bg-yellow-500",
  advanced: "bg-red-500",
};

export function RecommendedGoalCard({ goal }: RecommendedGoalCardProps) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    try {
      setIsAccepting(true);
      const response = await fetch(`/api/recommended-goals/${goal._id}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "dev-user", // Replace with actual user ID in production
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to accept recommendation");
      }

      // Refresh the page to update the UI
      router.refresh();
    } catch (error) {
      console.error("Error accepting recommendation:", error);
      // You might want to show a toast notification here
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDecline = async () => {
    try {
      setIsDeclining(true);
      const response = await fetch(`/api/recommended-goals/${goal._id}/decline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to decline recommendation");
      }

      // Refresh the page to update the UI
      router.refresh();
    } catch (error) {
      console.error("Error declining recommendation:", error);
      // You might want to show a toast notification here
    } finally {
      setIsDeclining(false);
      setShowDeclineDialog(false);
    }
  };

  return (
    <>
      <Card className="w-full hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">{goal.title}</CardTitle>
          <Sparkles className="h-5 w-5 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline">
                {categoryLabels[goal.category as keyof typeof categoryLabels]}
              </Badge>
              {goal.planDetails.requirements?.difficulty && (
                <Badge className={difficultyColors[goal.planDetails.requirements.difficulty as keyof typeof difficultyColors]}>
                  {goal.planDetails.requirements.difficulty}
                </Badge>
              )}
            </div>

            <p className="text-sm text-gray-600">{goal.description}</p>

            {goal.planDetails.requirements?.timeCommitment && (
              <div className="text-sm text-gray-500">
                Time Commitment: {goal.planDetails.requirements.timeCommitment}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1"
                variant="default"
                onClick={handleAccept}
                disabled={isAccepting}
              >
                {isAccepting ? (
                  "Accepting..."
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Accept
                  </>
                )}
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => setShowDeclineDialog(true)}
                disabled={isDeclining}
              >
                {isDeclining ? (
                  "Declining..."
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Decline
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline Recommendation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to decline this recommendation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDecline}>
              Decline
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 