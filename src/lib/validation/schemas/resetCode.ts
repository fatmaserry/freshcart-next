import { z } from "zod";

export const resetCodeSchema = z.object({
  resetCode: z.string().regex(/^\d{4,6}$/, "Enter the code from your email"),
});
