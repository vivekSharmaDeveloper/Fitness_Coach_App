import * as z from "zod";

export const goalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.enum([
    "fitness",
    "nutrition",
    "mental_health",
    "productivity",
    "sleep",
    "other",
  ]),
  specific: z.string().min(1, "Specific goal is required"),
  measurable: z.string().min(1, "Measurable criteria is required"),
  achievable: z.string().min(1, "Achievable criteria is required"),
  relevant: z.string().min(1, "Relevant criteria is required"),
  startDate: z.date(),
  endDate: z.date(),
  targetValue: z.number().min(0, "Target value must be positive"),
  unit: z.string().min(1, "Unit is required"),
  motivation: z.string().optional(),
  potentialObstacles: z.string().optional(),
  strategies: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["not_started", "in_progress", "completed", "abandoned"]).default("not_started"),
});

export type GoalFormData = z.infer<typeof goalSchema>; 