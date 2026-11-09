import { z } from "zod";
import type { LocationCatalog } from "@/lib/locations/LocationCatalog";
import { locationRule, phone } from "./shared";

export const addressSchema = z.object({
  name: z.string().min(2, "Give this address a name (e.g. Home)"),
  details: z.string().min(5, "Add street, building and apartment"),
  phone,
  governorate: z
    .string({ error: "Select a governorate" })
    .min(1, "Select a governorate"),
  city: z
    .string({ error: "Select a city or area" })
    .min(1, "Select a city or area"),
});

export const addressSchemaFor = (catalog?: LocationCatalog) => {
  const { check, opts } = locationRule(catalog);
  return addressSchema.refine(check, opts);
};

export type AddressValues = z.infer<typeof addressSchema>;
