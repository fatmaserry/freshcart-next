"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { InputHTMLAttributes, ReactNode } from "react";
import { useForm, useWatch, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/Spinner";
import { useSignUp } from "@/hooks/useAuthMutations";
import { cn, getErrorMessage } from "@/lib/utils";
import { passwordRules } from "@/lib/validation/schemas/shared";
import {
  registerSchema,
  type RegisterValues,
} from "@/lib/validation/schemas/register";
import { useAuth } from "@/providers/AuthProvider";
import { FormError } from "./FormError";
import { SocialAuthButtons } from "./SocialAuthButtons";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
  children?: ReactNode;
}

function Field({
  id,
  label,
  error,
  registration,
  children,
  ...input
}: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-body">
        {label}*
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        className={cn(
          "rounded-md border bg-surface-card px-3 py-2 text-heading placeholder:text-hint focus:outline-none",
          error
            ? "border-red-400 focus:border-red-500"
            : "border-hint/40 focus:border-brand-600",
        )}
        {...input}
        {...registration}
      />
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

function passwordStrength(password: string) {
  const score = passwordRules.filter((rule) => rule.test(password)).length;
  const strong = score === passwordRules.length;
  return {
    percent: (score / passwordRules.length) * 100,
    label: score <= 1 ? "Weak" : strong ? "Strong" : "Fair",
    color: score <= 1 ? "bg-red-500" : strong ? "bg-green-500" : "bg-amber-500",
  };
}

export function RegisterForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { register, handleSubmit, control, formState } =
    useForm<RegisterValues>({
      resolver: zodResolver(registerSchema),
      mode: "onTouched",
      defaultValues: { termsAccepted: false },
    });
  const errors = formState.errors;
  const password = useWatch({ control, name: "password" }) ?? "";
  const strength = passwordStrength(password);

  const mutation = useSignUp({
    onSuccess: async () => {
      await signIn({
        successMessage: "Account created — Welcome to FreshCart!",
      });
      router.replace("/");
      router.refresh();
    },
  });

  return (
    <div>
      <h2 className="mb-2 text-center text-3xl font-semibold text-heading">
        Create Your Account
      </h2>
      <p className="text-center text-body">
        Start your fresh journey with us today
      </p>

      <SocialAuthButtons action="sign up" />

      <div
        aria-hidden
        className="relative my-4 flex h-0.5 w-full items-center bg-line-soft text-body before:absolute before:left-1/2 before:top-1/2 before:-translate-1/2 before:bg-surface-card before:px-4 before:content-['or']"
      />

      <form
        onSubmit={handleSubmit(({ name, email, password, rePassword, phone }) =>
          mutation.mutate({ name, email, password, rePassword, phone }),
        )}
        className="space-y-7"
        noValidate
      >
        {mutation.error && (
          <FormError message={getErrorMessage(mutation.error)} />
        )}

        <Field
          id="name"
          label="Name"
          placeholder="Ali"
          autoComplete="name"
          error={errors.name?.message}
          registration={register("name")}
        />
        <Field
          id="email"
          label="Email"
          type="email"
          placeholder="ali@example.com"
          autoComplete="email"
          error={errors.email?.message}
          registration={register("email")}
        />
        <Field
          id="password"
          label="Password"
          type="password"
          placeholder="create a strong password"
          autoComplete="new-password"
          error={errors.password?.message}
          registration={register("password")}
        >
          <div className="flex items-center gap-2">
            <div
              role="progressbar"
              aria-label={`Password strength: ${strength.label}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={strength.percent}
              className="h-1 grow overflow-hidden rounded-md bg-line-strong"
            >
              <div
                className={cn(
                  "h-full transition-all duration-300 ease-out",
                  strength.color,
                )}
                style={{ width: `${strength.percent}%` }}
              />
            </div>
            <span className="min-w-12.5 text-sm font-medium text-body">
              {strength.label}
            </span>
          </div>
          <p className="-mt-2 text-xs text-muted">
            Must be at least 6 characters with an uppercase letter, a number and
            a symbol
          </p>
        </Field>
        <Field
          id="rePassword"
          label="Confirm Password"
          type="password"
          placeholder="confirm your password"
          autoComplete="new-password"
          error={errors.rePassword?.message}
          registration={register("rePassword")}
        />
        <Field
          id="phone"
          label="Phone Number"
          type="tel"
          placeholder="01012345678"
          autoComplete="tel"
          error={errors.phone?.message}
          registration={register("phone")}
        />

        <div>
          <div className="flex items-center gap-2">
            <input
              id="terms"
              type="checkbox"
              aria-invalid={!!errors.termsAccepted}
              className="size-4 accent-brand-600"
              {...register("termsAccepted")}
            />
            <label htmlFor="terms" className="ms-2 text-body">
              I agree to the{" "}
              <Link
                href="/terms"
                target="_blank"
                className="text-brand-600 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                target="_blank"
                className="text-brand-600 hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              *
            </label>
          </div>
          {errors.termsAccepted && (
            <p className="mt-2 text-sm text-red-600">
              {errors.termsAccepted.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          aria-busy={mutation.isPending}
          className="flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mutation.isPending ? (
            <Spinner className="me-2 h-4 w-4" />
          ) : (
            <Icon name="user-plus" size={18.8} className="me-2 w-5" />
          )}
          <span>Create My Account</span>
        </button>
      </form>

      <p className="border-t border-line-soft mt-6 p-5 text-center text-body">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-brand-600 hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
