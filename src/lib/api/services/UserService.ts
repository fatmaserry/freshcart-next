import { BaseService } from "./BaseService";
import type {
  AuthResponse,
  ChangePasswordPayload,
  UpdateMePayload,
  User,
} from "@/types/api";

export class UserService extends BaseService {
  protected readonly resource = "users";

  changePassword(payload: ChangePasswordPayload) {
    return this.http.put<AuthResponse>(
      this.path("/changeMyPassword"),
      payload,
      { auth: true },
    );
  }

  updateMe(payload: Partial<UpdateMePayload>) {
    return this.http.put<{ message: string; user: User }>(
      this.path("/updateMe"),
      payload,
      { auth: true },
    );
  }
}
