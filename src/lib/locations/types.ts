export interface City {
  id: string;
  nameEn: string;
  nameAr: string;
}

export interface Governorate {
  id: string;
  nameEn: string;
  nameAr: string;
  cities: City[];
}

export interface LocationsResponse {
  country: string;
  version: string;
  source: string;
  governorates: Governorate[];
}

export interface ResolvedLocation {
  governorate: Governorate;
  city: City;
  label: string;
}
