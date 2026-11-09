"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { api } from "@/lib/api";
import { ApiError } from "@/lib/api/HttpClient";
import { unwrap } from "@/lib/actions/result";
import { changePasswordAction, updateMeAction } from "@/actions/user.actions";
import type {
  ApiMessage,
  AuthResponse,
  ChangePasswordPayload,
  SignInPayload,
  SignUpPayload,
  UpdateMePayload,
  User,
} from "@/types/api";
import type { MutationOpts } from "./mutationOptions";

// redirect:false keeps login a client-side navigation.
async function credentialsSignIn({ email, password }: SignInPayload) {
  const res = await signIn("credentials", { email, password, redirect: false });
  if (!res || res.error)
    throw new ApiError(
      res?.code && res.code !== "credentials"
        ? res.code
        : "Incorrect email or password",
      401,
    );
  return res;
}

export const useSignIn = (
  opts?: MutationOpts<
    Awaited<ReturnType<typeof credentialsSignIn>>,
    SignInPayload
  >,
) => useMutation({ mutationFn: credentialsSignIn, ...opts });

export const useSignUp = (opts?: MutationOpts<AuthResponse, SignUpPayload>) =>
  useMutation({
    mutationFn: async (v: SignUpPayload) => {
      const res = await api.auth.signUp(v);
      await credentialsSignIn({ email: v.email, password: v.password });
      return res;
    },
    ...opts,
  });

export const useForgotPassword = (opts?: MutationOpts<ApiMessage, string>) =>
  useMutation({
    mutationFn: (email: string) => api.auth.forgotPassword(email),
    ...opts,
  });

export const useVerifyResetCode = (
  opts?: MutationOpts<{ status: string }, string>,
) =>
  useMutation({
    mutationFn: (code: string) => api.auth.verifyResetCode(code),
    ...opts,
  });

export const useResetPassword = (
  opts?: MutationOpts<
    { token: string },
    { email: string; newPassword: string }
  >,
) =>
  useMutation({
    mutationFn: (v: { email: string; newPassword: string }) =>
      api.auth.resetPassword(v),
    ...opts,
  });

export const useChangePassword = (
  opts?: MutationOpts<{ message: string; user: User }, ChangePasswordPayload>,
) =>
  useMutation({
    mutationFn: (v: ChangePasswordPayload) => unwrap(changePasswordAction(v)),
    ...opts,
  });

export const useUpdateMe = (
  opts?: MutationOpts<
    { message: string; user: User },
    Partial<UpdateMePayload>
  >,
) =>
  useMutation({
    mutationFn: (v: Partial<UpdateMePayload>) => unwrap(updateMeAction(v)),
    ...opts,
  });
