import type {
  City,
  Governorate,
  LocationsResponse,
  ResolvedLocation,
} from "./types";

export class LocationCatalog {
  private readonly byId: Map<string, Governorate>;

  constructor(private readonly data: LocationsResponse) {
    this.byId = new Map(data.governorates.map((g) => [g.id, g]));
  }

  get version() {
    return this.data.version;
  }

  governorates(): Governorate[] {
    return this.data.governorates;
  }

  governorate(id: string): Governorate | undefined {
    return this.byId.get(id);
  }

  cities(governorateId: string): City[] {
    return this.byId.get(governorateId)?.cities ?? [];
  }

  resolve(governorateId: string, cityId: string): ResolvedLocation | null {
    const governorate = this.byId.get(governorateId);
    const city = governorate?.cities.find((c) => c.id === cityId);
    if (!governorate || !city) return null;
    return {
      governorate,
      city,
      label: LocationCatalog.format(city, governorate),
    };
  }

  // Saved addresses store only the display label.
  findByLabel(label: string): ResolvedLocation | null {
    for (const governorate of this.data.governorates) {
      for (const city of governorate.cities) {
        if (LocationCatalog.format(city, governorate) === label)
          return { governorate, city, label };
      }
    }
    return null;
  }

  isValid(governorateId: string, cityId: string) {
    return this.resolve(governorateId, cityId) !== null;
  }

  static format(city: City, governorate: Governorate) {
    return city.nameEn === governorate.nameEn
      ? city.nameEn
      : `${city.nameEn}, ${governorate.nameEn}`;
  }

  static matches(item: { nameEn: string; nameAr: string }, query: string) {
    const q = query.trim().toLowerCase();
    return (
      !q ||
      item.nameEn.toLowerCase().includes(q) ||
      item.nameAr.includes(query.trim())
    );
  }
}
