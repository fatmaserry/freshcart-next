import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { SignUpWelcome } from "@/components/auth/SignUpWelcome";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <div className="py-10">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 p-4 lg:grid-cols-2">
        <SignUpWelcome />
        <div className="rounded-2xl bg-surface-card px-7 py-8 shadow-lg">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
