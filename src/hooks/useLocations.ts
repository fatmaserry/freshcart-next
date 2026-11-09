"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query/keys";

export const useLocations = () =>
  useQuery({
    queryKey: queryKeys.locations,
    queryFn: () => api.locations.getCatalog(),
    staleTime: Infinity,
    gcTime: Infinity,
  });
