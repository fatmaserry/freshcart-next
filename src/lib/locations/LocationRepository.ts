import data from "@/data/egypt-locations.json";
import type { LocationsResponse } from "./types";

export class LocationRepository {
  getAll(): LocationsResponse {
    return data as LocationsResponse;
  }
}

export const locationRepository = new LocationRepository();
