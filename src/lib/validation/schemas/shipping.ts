import type { z } from "zod";
import type { LocationCatalog } from "@/lib/locations/LocationCatalog";
import { addressSchema } from "./address";
import { locationRule } from "./shared";

export const shippingSchema = addressSchema.omit({ name: true });

export const shippingSchemaFor = (catalog?: LocationCatalog) => {
  const { check, opts } = locationRule(catalog);
  return shippingSchema.refine(check, opts);
};

export type ShippingValues = z.infer<typeof shippingSchema>;
