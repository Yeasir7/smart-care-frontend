import { z } from "zod";

export const createAdminFormZodSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(20, "Password must be at most 20 characters"),
  contactNumber: z.string().min(11, "Contact number must be at least 11 characters").max(15, "Contact number must be at most 15 characters").optional().or(z.literal("")),
  role: z.enum(["ADMIN", "SUPER_ADMIN"]).default("ADMIN"),
});

export type ICreateAdminFormValues = z.infer<typeof createAdminFormZodSchema>;
