import { CatalogService } from "./BaseService";
import type { Category, Paginated, SubCategory } from "@/types/api";

export class CategoryService extends CatalogService<Category> {
  protected readonly resource = "categories";

  getSubCategories(categoryId: string) {
    return this.http.get<Paginated<SubCategory>>(
      this.path(`/${categoryId}/subcategories`),
    );
  }
}
