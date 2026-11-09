import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Enter your name"),
  email: z.email("Enter a valid email"),
  subject: z.string().min(1, "Select a subject"),
  message: z.string().trim().min(1, "Tell us how we can help"),
});

export type ContactValues = z.infer<typeof contactSchema>;
