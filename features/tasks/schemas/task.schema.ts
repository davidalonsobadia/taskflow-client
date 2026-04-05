import { z } from "zod"

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or fewer"),
  description: z.string().max(1000, "Description must be 1000 characters or fewer").optional(),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().optional(),
})

export type TaskFormData = z.infer<typeof taskSchema>
