import { z } from "zod";
import type { LocationCatalog } from "@/lib/locations/LocationCatalog";

export const passwordRules = [
  {
    message: "Password must be at least 6 characters",
    test: (value: string) => value.length >= 6,
  },
  {
    message: "Password must contain an uppercase letter",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    message: "Password must contain a number",
    test: (value: string) => /\d/.test(value),
  },
  {
    message: "Password must contain a special character",
    test: (value: string) => /[^A-Za-z0-9\s]/.test(value),
  },
] as const;

export const password = z.string().superRefine((value, context) => {
  for (const rule of passwordRules) {
    if (!rule.test(value)) {
      context.addIssue({ code: "custom", message: rule.message });
    }
  }
});

export const phone = z
  .string()
  .regex(/^01[0125][0-9]{8}$/, "Enter a valid Egyptian phone number");

export const locationRule = (catalog?: LocationCatalog) => ({
  check: (d: { governorate: string; city: string }) =>
    !!catalog?.isValid(d.governorate, d.city),
  opts: { message: "Select a city from the list", path: ["city"] },
});
