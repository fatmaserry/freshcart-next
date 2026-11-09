import { z } from "zod";

export const forgotEmailSchema = z.object({
  email: z.email("Enter a valid email"),
});
