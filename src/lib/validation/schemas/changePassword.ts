import { z } from "zod";
import { password } from "./shared";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    password,
    rePassword: z.string(),
  })
  .refine((d) => d.password === d.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
