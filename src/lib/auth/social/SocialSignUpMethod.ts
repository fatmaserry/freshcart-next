import type { IconRef } from "@/components/ui/icons";

export interface SocialSignUpMethod {
  readonly id: string;
  readonly label: string;
  readonly icon: IconRef;
  readonly iconClassName: string;
}
