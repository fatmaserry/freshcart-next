import { BaseService } from "./BaseService";
import type { Paginated, Product, ProductQuery, Single } from "@/types/api";

export class ProductService extends BaseService {
  protected readonly resource = "products";

  getAll(q: ProductQuery = {}) {
    return this.http.get<Paginated<Product>>(this.path(), {
      query: {
        page: q.page,
        limit: q.limit,
        sort: q.sort,
        brand: q.brand,
        "category[in]": q.category,
        subcategory: q.subcategory,
      },
    });
  }

  async getById(id: string): Promise<Product> {
    const res = await this.http.get<Single<Product>>(this.path(`/${id}`));
    return res.data;
  }
}
