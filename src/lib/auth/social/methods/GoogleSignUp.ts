import type { SocialSignUpMethod } from "../SocialSignUpMethod";

export class GoogleSignUp implements SocialSignUpMethod {
  readonly id = "google";
  readonly label = "Google";
  readonly icon = "google" as const;
  readonly iconClassName = "text-red-500";
}
