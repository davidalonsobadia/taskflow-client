import { z } from "zod"

export const listSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or fewer"),
  description: z.string().max(500, "Description must be 500 characters or fewer").optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color value"),
})

export type ListFormData = z.infer<typeof listSchema>
