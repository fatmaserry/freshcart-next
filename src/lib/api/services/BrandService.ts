import { CatalogService } from "./BaseService";
import type { Brand } from "@/types/api";

export class BrandService extends CatalogService<Brand> {
  protected readonly resource = "brands";
}
