import type { SocialSignUpMethod } from "../SocialSignUpMethod";

export class FacebookSignUp implements SocialSignUpMethod {
  readonly id = "facebook";
  readonly label = "Facebook";
  readonly icon = "facebook" as const;
  readonly iconClassName = "text-blue-500";
}
