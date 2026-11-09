import { z } from "zod";
import { password, phone } from "./shared";

export const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters").max(30),
    email: z.email("Enter a valid email"),
    phone,
    password,
    rePassword: z.string(),
    termsAccepted: z.boolean().refine(Boolean, "You must accept the terms"),
  })
  .refine((d) => d.password === d.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export type RegisterValues = z.infer<typeof registerSchema>;
