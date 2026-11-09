import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordFlow } from "@/components/auth/ForgotPasswordFlow";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <ForgotPasswordFlow />
    </AuthShell>
  );
}
