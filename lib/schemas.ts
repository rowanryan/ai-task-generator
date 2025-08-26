import { z } from "zod";

export const AiTaskSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    status: z.enum(["todo", "in_progress", "done"]),
    department: z.enum(["marketing", "development", "sales", "finance"]),
    priority: z.enum(["low", "medium", "high"]),
    storyPoints: z.enum(["1", "2", "3", "5", "8"]).optional(),
    subtasks: z.array(z.string()).optional(),
});
