"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const goalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.enum(["fitness", "nutrition", "mental_health", "productivity", "sleep", "other"]),
  specific: z.string().min(1, "Specific goal is required"),
  measurable: z.string().min(1, "Measurable criteria is required"),
  achievable: z.string().min(1, "Achievability criteria is required"),
  relevant: z.string().min(1, "Relevance explanation is required"),
  startDate: z.date(),
  endDate: z.date(),
  targetValue: z.number().min(0),
  unit: z.string().min(1, "Unit is required"),
  motivation: z.string().optional(),
  potentialObstacles: z.string().optional(),
  strategies: z.string().optional(),
  notes: z.string().optional(),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface GoalDefinitionFormProps {
  userId: string;
}

export function GoalDefinitionForm({ userId }: GoalDefinitionFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const onSubmit = async (data: GoalFormData) => {
    try {
      setIsSubmitting(true);
      console.log("Form data:", data);
      console.log("User ID:", userId);

      // Ensure all required fields are present
      if (!data.title || !data.category || !data.specific || !data.measurable || 
          !data.achievable || !data.relevant || !data.startDate || !data.endDate || 
          !data.targetValue || !data.unit) {
        throw new Error("Please fill in all required fields");
      }

      // Convert dates to ISO strings
      const formattedData = {
        ...data,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        userId,
      };

      console.log("Sending data to API:", formattedData);

      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Response data:", result);

      if (!response.ok) {
        throw new Error(result.details || result.error || "Failed to create goal");
      }

      toast({
        title: "Success!",
        description: "Your goal has been created successfully.",
        className: "fixed top-4 left-1/2 transform -translate-x-1/2 z-50",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error creating goal:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create goal",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Goal Title</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="e.g., Run a 5K"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            onValueChange={(value) => {
              console.log("Selected category:", value);
              setValue("category", value as any);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fitness">Fitness</SelectItem>
              <SelectItem value="nutrition">Nutrition</SelectItem>
              <SelectItem value="mental_health">Mental Health</SelectItem>
              <SelectItem value="productivity">Productivity</SelectItem>
              <SelectItem value="sleep">Sleep</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="specific">Specific</Label>
          <Textarea
            id="specific"
            {...register("specific")}
            placeholder="What exactly do you want to achieve?"
          />
          {errors.specific && (
            <p className="text-sm text-red-500">{errors.specific.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="measurable">Measurable</Label>
          <Textarea
            id="measurable"
            {...register("measurable")}
            placeholder="How will you measure your progress?"
          />
          {errors.measurable && (
            <p className="text-sm text-red-500">{errors.measurable.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="achievable">Achievable</Label>
          <Textarea
            id="achievable"
            {...register("achievable")}
            placeholder="Is this goal realistic and attainable?"
          />
          {errors.achievable && (
            <p className="text-sm text-red-500">{errors.achievable.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="relevant">Relevant</Label>
          <Textarea
            id="relevant"
            {...register("relevant")}
            placeholder="Why is this goal important to you?"
          />
          {errors.relevant && (
            <p className="text-sm text-red-500">{errors.relevant.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    console.log("Selected start date:", date);
                    date && setValue("startDate", date);
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.startDate && (
              <p className="text-sm text-red-500">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? (
                    format(endDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => {
                    console.log("Selected end date:", date);
                    date && setValue("endDate", date);
                  }}
                  disabled={(date) => date < startDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.endDate && (
              <p className="text-sm text-red-500">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="targetValue">Target Value</Label>
            <Input
              id="targetValue"
              type="number"
              {...register("targetValue", { valueAsNumber: true })}
              placeholder="e.g., 5"
            />
            {errors.targetValue && (
              <p className="text-sm text-red-500">{errors.targetValue.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              {...register("unit")}
              placeholder="e.g., km, kg, minutes"
            />
            {errors.unit && (
              <p className="text-sm text-red-500">{errors.unit.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="motivation">Motivation (Optional)</Label>
          <Textarea
            id="motivation"
            {...register("motivation")}
            placeholder="What motivates you to achieve this goal?"
          />
        </div>

        <div>
          <Label htmlFor="potentialObstacles">Potential Obstacles (Optional)</Label>
          <Textarea
            id="potentialObstacles"
            {...register("potentialObstacles")}
            placeholder="What might get in your way?"
          />
        </div>

        <div>
          <Label htmlFor="strategies">Strategies (Optional)</Label>
          <Textarea
            id="strategies"
            {...register("strategies")}
            placeholder="How will you overcome these obstacles?"
          />
        </div>

        <div>
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            {...register("notes")}
            placeholder="Any other important details?"
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Goal"}
      </Button>
    </form>
  );
} 