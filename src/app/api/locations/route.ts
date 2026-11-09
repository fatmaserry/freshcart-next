import { locationRepository } from "@/lib/locations/LocationRepository";

export function GET() {
  return Response.json(locationRepository.getAll(), {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
