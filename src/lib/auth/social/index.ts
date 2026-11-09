import { FacebookSignUp } from "./methods/FacebookSignUp";
import { GoogleSignUp } from "./methods/GoogleSignUp";

export type { SocialSignUpMethod } from "./SocialSignUpMethod";

export const socialSignUpMethods = [new GoogleSignUp(), new FacebookSignUp()];
