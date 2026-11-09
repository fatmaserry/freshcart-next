import { z } from "zod";
import { password } from "./shared";

export const newPasswordSchema = z
  .object({ newPassword: password, confirm: z.string() })
  .refine((d) => d.newPassword === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });
