import { BaseService } from "@/lib/api/services/BaseService";
import { LocationCatalog } from "./LocationCatalog";
import type { LocationsResponse } from "./types";

export class LocationService extends BaseService {
  protected readonly resource = "locations";

  async getCatalog(): Promise<LocationCatalog> {
    return new LocationCatalog(
      await this.http.get<LocationsResponse>(this.path()),
    );
  }
}
