import { z } from "zod";

export const credentialsSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(32, "Username must be at most 32 characters.")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Username can only contain letters, numbers, _ . -"),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const goalCategorySchema = z.enum(["HEALTH", "CAREER", "PERSONAL", "SOCIAL"]);

export const goalItemSchema = z.object({
  weekId: z.string().min(1),
  category: goalCategorySchema,
  title: z.string().trim().min(1, "Goal text is required.").max(280),
});

export const dailyNoteSchema = z.object({
  weekId: z.string().min(1),
  date: z.string().min(1),
  content: z.string().max(10000),
});

export const eventSchema = z.object({
  monthId: z.string().min(1),
  title: z.string().trim().min(1, "Title is required.").max(200),
  date: z.string().min(1),
  time: z.string().max(20).optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export const financeSchema = z.object({
  monthId: z.string().min(1),
  totalIncome: z.coerce.number().min(0),
  totalSavings: z.coerce.number().min(0),
  totalExpenses: z.coerce.number().min(0),
  notes: z.string().max(5000).optional().or(z.literal("")),
});

export const monthlyReflectionSchema = z.object({
  monthId: z.string().min(1),
  emotions: z.string().max(5000).optional().or(z.literal("")),
  whatWentWell: z.string().max(5000).optional().or(z.literal("")),
  whatWentWrong: z.string().max(5000).optional().or(z.literal("")),
  notes: z.string().max(5000).optional().or(z.literal("")),
});

export const weeklyReflectionAnswerSchema = z.object({
  weekId: z.string().min(1),
  answer: z.string().max(5000),
});
