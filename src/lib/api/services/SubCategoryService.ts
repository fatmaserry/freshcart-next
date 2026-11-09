import { CatalogService } from "./BaseService";
import type { SubCategory } from "@/types/api";

export class SubCategoryService extends CatalogService<SubCategory> {
  protected readonly resource = "subcategories";
}
