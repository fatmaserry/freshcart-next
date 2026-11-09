import { z } from "zod";
import { phone } from "./shared";

export const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email("Enter a valid email"),
  phone: phone.or(z.literal("")),
});

export type ProfileValues = z.infer<typeof profileSchema>;
