"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/Spinner";
import { useSignIn } from "@/hooks/useAuthMutations";
import { cn, getErrorMessage, safeInternalPath } from "@/lib/utils";
import { loginSchema, type LoginValues } from "@/lib/validation/schemas/login";
import { useAuth } from "@/providers/AuthProvider";
import { AuthHeading } from "./AuthHeading";
import { FormError } from "./FormError";
import { SocialAuthButtons } from "./SocialAuthButtons";

const inputClass =
  "w-full rounded-xl border-2 border-line-strong bg-surface-card px-4 py-3 pl-12 text-heading transition-all placeholder:text-hint focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";
const inputIconClass = "absolute left-4 top-1/2 w-5 -translate-y-1/2 text-hint";

const trustBadges = [
  { icon: "lock", label: "SSL Secured" },
  { icon: "users", label: "50K+ Users" },
  { icon: { name: "star", filled: true }, label: "4.9 Rating" },
] as const;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-sm text-red-600">*{message}</p>;
}

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });
  const errors = formState.errors;

  const mutation = useSignIn({
    onSuccess: async () => {
      await signIn({ remember, successMessage: "Welcome back!" });
      // Read on demand so the form doesn't need useSearchParams and a Suspense boundary.
      const redirect = new URLSearchParams(window.location.search).get(
        "redirect",
      );
      router.replace(safeInternalPath(redirect));
      router.refresh();
    },
  });

  return (
    <div>
      <AuthHeading
        title="Welcome Back!"
        subtitle="Sign in to continue your fresh shopping experience"
      />

      <SocialAuthButtons action="sign in" />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-line-strong" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-surface-card px-4 font-medium text-muted">
            OR CONTINUE WITH EMAIL
          </span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit((v) => mutation.mutate(v))}
        className="space-y-6"
        noValidate
      >
        {mutation.error && (
          <FormError message={getErrorMessage(mutation.error)} />
        )}

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-body"
          >
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              aria-invalid={!!errors.email}
              className={inputClass}
              {...register("email")}
            />
            <Icon name="mail" filled size={18.8} className={inputIconClass} />
          </div>
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-body"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={!!errors.password}
              className={cn(inputClass, "pr-12")}
              {...register("password")}
            />
            <Icon name="lock" size={18.8} className={inputIconClass} />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-hint hover:text-body"
            >
              <Icon
                name={showPassword ? "eye-off" : "eye"}
                filled
                size={18.8}
                className="w-5"
              />
            </button>
          </div>
          <FieldError message={errors.password?.message} />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded accent-brand-600"
            />
            <span className="ml-3 text-sm text-body">Keep me signed in</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded-xl bg-brand-600 px-4 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-brand-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mutation.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner className="h-4 w-4" /> Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="mt-8 border-t border-line-soft pt-6 text-center">
        <p className="text-body">
          New to FreshCart?
          <Link
            href="/register"
            className="ms-2 font-semibold text-brand-600 hover:text-brand-700"
          >
            Create an account
          </Link>
        </p>
      </div>

      <div className="mt-6 flex items-center justify-center space-x-6 text-xs text-muted">
        {trustBadges.map(({ icon, label }) => (
          <div key={label} className="flex items-center">
            <Icon name={icon} size={14} className="mr-1 w-3.75" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
