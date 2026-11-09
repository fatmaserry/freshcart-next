"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@/components/ui/icons";
import { toast } from "react-toastify";
import { z } from "zod";
import { cn, getErrorMessage } from "@/lib/utils";
import { forgotEmailSchema } from "@/lib/validation/schemas/forgotEmail";
import { newPasswordSchema } from "@/lib/validation/schemas/newPassword";
import { resetCodeSchema } from "@/lib/validation/schemas/resetCode";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormError } from "./FormError";
import { AuthHeading } from "./AuthHeading";
import {
  useForgotPassword,
  useResetPassword,
  useVerifyResetCode,
} from "@/hooks/useAuthMutations";

type Step = "email" | "code" | "password";
const steps: { id: Step; label: string }[] = [
  { id: "email", label: "Email" },
  { id: "code", label: "Verify" },
  { id: "password", label: "New password" },
];

function EmailStep({ onDone }: { onDone: (email: string) => void }) {
  const form = useForm<z.infer<typeof forgotEmailSchema>>({
    resolver: zodResolver(forgotEmailSchema),
  });
  const m = useForgotPassword({
    onSuccess: (res, email) => {
      toast.success(res.message ?? "Reset code sent to your email");
      onDone(email);
    },
  });
  return (
    <form
      onSubmit={form.handleSubmit((v) => m.mutate(v.email))}
      className="space-y-5"
      noValidate
    >
      {m.error && <FormError message={getErrorMessage(m.error)} />}
      <Input
        label="Email"
        type="email"
        icon={<Icon name="mail" filled size={17} />}
        placeholder="you@example.com"
        error={form.formState.errors.email?.message}
        {...form.register("email")}
      />
      <Button type="submit" size="lg" className="w-full" loading={m.isPending}>
        Send reset code
      </Button>
    </form>
  );
}

function CodeStep({
  email,
  onDone,
  onResend,
}: {
  email: string;
  onDone: () => void;
  onResend: () => void;
}) {
  const form = useForm<z.infer<typeof resetCodeSchema>>({
    resolver: zodResolver(resetCodeSchema),
  });
  const m = useVerifyResetCode({
    onSuccess: () => {
      toast.success("Code verified");
      onDone();
    },
  });
  const resend = useForgotPassword({
    onSuccess: () => toast.success("A new code is on its way"),
    onError: (e) => toast.error(getErrorMessage(e)),
  });
  return (
    <form
      onSubmit={form.handleSubmit((v) => m.mutate(v.resetCode))}
      className="space-y-5"
      noValidate
    >
      <div className="flex items-start gap-3 rounded-xl bg-brand-50 p-4 text-sm text-brand-800">
        <Icon name="mail-check" size={20} className="shrink-0" />
        <p>
          We sent a verification code to <b>{email}</b>. It expires in 10
          minutes.
        </p>
      </div>
      {m.error && <FormError message={getErrorMessage(m.error)} />}
      <Input
        label="Verification code"
        inputMode="numeric"
        autoComplete="one-time-code"
        icon={<Icon name="key-round" size={17} />}
        placeholder="123456"
        className="tracking-[0.4em]"
        error={form.formState.errors.resetCode?.message}
        {...form.register("resetCode")}
      />
      <Button type="submit" size="lg" className="w-full" loading={m.isPending}>
        Verify code
      </Button>
      <div className="flex justify-between text-sm">
        <button
          type="button"
          onClick={onResend}
          className="font-semibold text-muted hover:text-heading"
        >
          Change email
        </button>
        <button
          type="button"
          onClick={() => resend.mutate(email)}
          disabled={resend.isPending}
          className="font-semibold text-brand-700 hover:underline disabled:opacity-50"
        >
          Resend code
        </button>
      </div>
    </form>
  );
}

function PasswordStep({ email }: { email: string }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
  });
  const m = useResetPassword({
    onSuccess: () => {
      toast.success(
        "Password reset successfully. Log in with your new password.",
      );
      router.replace("/login");
    },
  });
  return (
    <form
      onSubmit={form.handleSubmit((v) =>
        m.mutate({ email, newPassword: v.newPassword }),
      )}
      className="space-y-5"
      noValidate
    >
      {m.error && <FormError message={getErrorMessage(m.error)} />}
      <Input
        label="New password"
        type="password"
        autoComplete="new-password"
        icon={<Icon name="lock" size={17} />}
        error={form.formState.errors.newPassword?.message}
        {...form.register("newPassword")}
      />
      <Input
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        icon={<Icon name="lock" size={17} />}
        error={form.formState.errors.confirm?.message}
        {...form.register("confirm")}
      />
      <Button type="submit" size="lg" className="w-full" loading={m.isPending}>
        Reset password
      </Button>
    </form>
  );
}

export function ForgotPasswordFlow() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const current = steps.findIndex((s) => s.id === step);

  return (
    <div>
      <Link
        href="/login"
        className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-heading"
      >
        <Icon name="arrow-left" size={16} /> Back to Sign In
      </Link>
      <AuthHeading
        title="Reset Your Password"
        subtitle="Follow three quick steps to get back into your account"
      />

      <ol className="mb-8 flex items-center gap-2">
        {steps.map((s, i) => (
          <li key={s.id} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition",
                i <= current
                  ? "bg-brand-600 text-white"
                  : "bg-line-strong text-muted",
              )}
            >
              {i + 1}
            </span>
            <span
              className={cn(
                "hidden text-sm font-semibold sm:block",
                i <= current ? "text-heading" : "text-hint",
              )}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <span
                className={cn(
                  "h-0.5 flex-1 rounded",
                  i < current ? "bg-brand-600" : "bg-line-strong",
                )}
              />
            )}
          </li>
        ))}
      </ol>

      {step === "email" && (
        <EmailStep
          onDone={(e) => {
            setEmail(e);
            setStep("code");
          }}
        />
      )}
      {step === "code" && (
        <CodeStep
          email={email}
          onDone={() => setStep("password")}
          onResend={() => setStep("email")}
        />
      )}
      {step === "password" && <PasswordStep email={email} />}
    </div>
  );
}
