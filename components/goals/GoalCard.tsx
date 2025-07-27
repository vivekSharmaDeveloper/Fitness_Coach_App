"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Trash2, Pencil, RotateCcw } from "lucide-react";

interface Goal {
  _id: string;
  title: string;
  category: string;
  targetValue: number;
  unit: string;
  currentProgress?: number;
  startDate: string;
  endDate: string;
  status: "not_started" | "in_progress" | "completed" | "abandoned";
}

interface GoalCardProps {
  goal: Goal;
  onProgressUpdate: (goalId: string, progress: number) => Promise<any>;
  showCategory?: boolean;
  refreshGoals?: () => void;
}

const CATEGORY_OPTIONS = [
  "fitness",
  "nutrition",
  "mental_health",
  "productivity",
  "sleep",
  "other",
];

const GoalCard = ({ goal, onProgressUpdate, showCategory = false, refreshGoals }: GoalCardProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(goal.currentProgress || 0);
  const [progressPercentage, setProgressPercentage] = useState(
    Math.min(((goal.currentProgress || 0) / goal.targetValue) * 100, 100)
  );
  const [showTooltip, setShowTooltip] = useState(false);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(goal.title);
  const [editTarget, setEditTarget] = useState(goal.targetValue.toString());
  const [editCategory, setEditCategory] = useState(goal.category);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    setCurrentProgress(goal.currentProgress || 0);
    setEditTitle(goal.title);
    setEditTarget(goal.targetValue.toString());
    setEditCategory(goal.category);
    setProgressPercentage(Math.min(((goal.currentProgress || 0) / goal.targetValue) * 100, 100));
  }, [goal]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const capitalizeCategory = (category: string) => {
    return category.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const calculateQuickAddValue = (percentage: number) => {
    return Math.floor((goal.targetValue * percentage) / 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow non-negative numbers
    if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setInputValue(value);
      setError(""); // Clear error when input changes
    }
  };

  const handleProgressUpdate = async () => {
    const newProgress = Number(inputValue);
    
    // Check for zero or invalid input
    if (newProgress === 0) {
      setError("Please enter a value greater than 0");
      return;
    }
    
    if (isNaN(newProgress) || newProgress < 0) {
      setError("Please enter a valid number");
      return;
    }

    setIsLoading(true);
    try {
      const updatedProgress = currentProgress + newProgress;
      await onProgressUpdate(goal._id, updatedProgress);
      setCurrentProgress(updatedProgress);
      setProgressPercentage(Math.min((updatedProgress / goal.targetValue) * 100, 100));
      setInputValue("");
      setError("");
      toast({
        title: "Progress updated",
        description: `Added ${newProgress} ${goal.unit}`,
        className: "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-1/4",
      });
    } catch (error) {
      console.error("Error in handleProgressUpdate:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update progress",
        variant: "destructive",
        className: "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-1/4",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdd = async (percentage: number) => {
    const valueToAdd = calculateQuickAddValue(percentage);
    const newProgress = currentProgress + valueToAdd;
    setIsLoading(true);
    try {
      await onProgressUpdate(goal._id, newProgress);
      setCurrentProgress(newProgress);
      setProgressPercentage(Math.min((newProgress / goal.targetValue) * 100, 100));
      setInputValue("");
      setError("");
      toast({
        title: "Progress updated",
        description: `Added ${valueToAdd} ${goal.unit}`,
        className: "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-1/4",
      });
    } catch (error) {
      console.error("Error in handleQuickAdd:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update progress",
        variant: "destructive",
        className: "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-1/4",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage <= 33) {
      return "bg-gradient-to-r from-red-500 to-red-600 dark:from-red-400 dark:to-red-500";
    } else if (percentage <= 66) {
      return "bg-gradient-to-r from-amber-400 to-amber-500 dark:from-amber-300 dark:to-amber-400";
    } else {
      return "bg-gradient-to-r from-emerald-400 to-emerald-500 dark:from-emerald-300 dark:to-emerald-400";
    }
  };

  // --- Edit Modal Handlers ---
  const handleEditSave = async () => {
    setEditLoading(true);
    setEditError("");
    try {
      // Call API to update goal (implement this endpoint if not present)
      const res = await fetch(`/api/goals/${goal._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          targetValue: Number(editTarget),
          category: editCategory,
        }),
      });
      if (!res.ok) throw new Error("Failed to update goal");
      toast({ title: "Goal updated" });
      setEditOpen(false);
      if (refreshGoals) refreshGoals();
    } catch (err: any) {
      setEditError(err.message || "Failed to update goal");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    setEditLoading(true);
    setEditError("");
    try {
      // Call API to delete goal (implement this endpoint if not present)
      const res = await fetch(`/api/goals/${goal._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete goal");
      toast({ title: "Goal deleted" });
      setEditOpen(false);
      if (refreshGoals) refreshGoals();
      // Optionally, trigger a refresh or callback
    } catch (err: any) {
      setEditError(err.message || "Failed to delete goal");
    } finally {
      setEditLoading(false);
    }
  };

  const handleResetToday = async () => {
    setEditLoading(true);
    setEditError("");
    try {
      // Call API to reset today's progress (implement this endpoint if not present)
      const res = await fetch(`/api/goals/${goal._id}/reset-today`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to reset today's progress");
      toast({ title: "Today's progress reset" });
      setEditOpen(false);
      if (refreshGoals) refreshGoals();
    } catch (err: any) {
      setEditError(err.message || "Failed to reset progress");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{goal.title}</CardTitle>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-accent/50"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <Info className="h-4 w-4 text-muted-foreground" />
              </Button>
              {showTooltip && (
                <div
                  className={cn(
                    "absolute z-50 px-4 py-3 text-sm bg-popover text-popover-foreground rounded-lg border shadow-lg",
                    "animate-in fade-in-0 zoom-in-95 duration-200",
                    "top-full left-1/2 transform -translate-x-1/2 mt-2",
                    "min-w-[200px]"
                  )}
                >
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-popover border-t border-l rotate-45" />
                  <div className="relative space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-muted-foreground">Start:</span>
                      <span>{formatDate(goal.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-muted-foreground">End:</span>
                      <span>{formatDate(goal.endDate)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showCategory && (
              <Badge variant="secondary">{capitalizeCategory(goal.category)}</Badge>
            )}
            <AlertDialog open={editOpen} onOpenChange={setEditOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Edit goal">
                  <Pencil className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Edit Goal</AlertDialogTitle>
                  <AlertDialogDescription>
                    Update your goal details below. You can also delete this goal or reset today's progress.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleEditSave(); }}>
                  <div>
                    <Label htmlFor="edit-title">Goal Name</Label>
                    <Input
                      id="edit-title"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      disabled={editLoading}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-target">Target</Label>
                    <Input
                      id="edit-target"
                      type="number"
                      value={editTarget}
                      onChange={e => setEditTarget(e.target.value)}
                      disabled={editLoading}
                      min={1}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-category">Category</Label>
                    <Select
                      value={editCategory}
                      onValueChange={setEditCategory}
                      disabled={editLoading}
                    >
                      <SelectTrigger id="edit-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map(option => (
                          <SelectItem key={option} value={option}>
                            {capitalizeCategory(option)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={editLoading}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResetToday}
                      disabled={editLoading}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" /> Reset Today's Progress
                    </Button>
                    <Button type="submit" disabled={editLoading}>
                      {editLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                  {editError && <p className="text-sm text-red-500 mt-2">{editError}</p>}
                </form>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={editLoading}>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Target</span>
            <span>
              {goal.targetValue} {goal.unit}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current Progress</span>
              <span>
                {currentProgress} {goal.unit}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="flex-1"
                  placeholder={`Enter ${goal.unit}`}
                  disabled={isLoading}
                  min="0"
                />
                <Button 
                  onClick={handleProgressUpdate}
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update"}
                </Button>
              </div>
              {error && (
                <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className={cn(
                "h-2.5 transition-all duration-700 ease-in-out shadow-sm",
                getProgressColor(progressPercentage)
              )}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => handleQuickAdd(10)}
              disabled={isLoading}
            >
              +{calculateQuickAddValue(10)} {goal.unit}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => handleQuickAdd(30)}
              disabled={isLoading}
            >
              +{calculateQuickAddValue(30)} {goal.unit}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => handleQuickAdd(50)}
              disabled={isLoading}
            >
              +{calculateQuickAddValue(50)} {goal.unit}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalCard; 