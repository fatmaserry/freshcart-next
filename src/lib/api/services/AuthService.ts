import { BaseService } from "./BaseService";
import type {
  ApiMessage,
  AuthResponse,
  ResetPasswordPayload,
  SignInPayload,
  SignUpPayload,
} from "@/types/api";

export class AuthService extends BaseService {
  protected readonly resource = "auth";

  signIn(payload: SignInPayload) {
    return this.http.post<AuthResponse>(this.path("/signin"), payload);
  }

  signUp(payload: SignUpPayload) {
    return this.http.post<AuthResponse>(this.path("/signup"), payload);
  }

  forgotPassword(email: string) {
    return this.http.post<ApiMessage>(this.path("/forgotPasswords"), { email });
  }

  verifyResetCode(resetCode: string) {
    return this.http.post<{ status: string }>(this.path("/verifyResetCode"), {
      resetCode,
    });
  }

  resetPassword(payload: ResetPasswordPayload) {
    return this.http.put<{ token: string }>(
      this.path("/resetPassword"),
      payload,
    );
  }
}
