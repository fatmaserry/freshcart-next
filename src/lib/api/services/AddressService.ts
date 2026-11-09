import { BaseService } from "./BaseService";
import type { AddressListResponse, AddressPayload, Address } from "@/types/api";

export class AddressService extends BaseService {
  protected readonly resource = "addresses";

  getAll() {
    return this.http.get<AddressListResponse>(this.path(), { auth: true });
  }

  async getById(id: string): Promise<Address> {
    const res = await this.http.get<{ data: Address }>(this.path(`/${id}`), {
      auth: true,
    });
    return res.data;
  }

  add(payload: AddressPayload) {
    return this.http.post<AddressListResponse>(this.path(), payload, {
      auth: true,
    });
  }

  remove(id: string) {
    return this.http.delete<AddressListResponse>(this.path(`/${id}`), {
      auth: true,
    });
  }
}
