import type { HttpClient } from "../HttpClient";
import type { Paginated, Single } from "@/types/api";

export abstract class BaseService {
  protected abstract readonly resource: string;

  constructor(protected readonly http: HttpClient) {}

  protected path(suffix = "") {
    return `/${this.resource}${suffix}`;
  }
}

export abstract class CatalogService<T> extends BaseService {
  getAll(params: { page?: number; limit?: number } = {}) {
    return this.http.get<Paginated<T>>(this.path(), { query: params });
  }

  async getById(id: string): Promise<T> {
    const res = await this.http.get<Single<T>>(this.path(`/${id}`));
    return res.data;
  }
}
