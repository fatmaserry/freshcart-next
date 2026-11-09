"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut as authSignOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { queryKeys } from "@/lib/query/keys";
import {
  isBrowserSessionOver,
  startBrowserSession,
} from "@/lib/auth/browserSession";
import { mergeGuestData } from "@/lib/guest/mergeGuestData";
import { useGuestTabSync } from "@/hooks/useGuestTabSync";
import type { User } from "@/types/api";

const subscribeToNothing = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

interface AuthContextValue {
  user: (User & { id: string }) | null;
  userId: string | null;
  isReady: boolean;
  isAuthenticated: boolean;
  signIn: (opts?: {
    remember?: boolean;
    successMessage?: string;
  }) => Promise<void>;
  signOut: (opts?: { silent?: boolean }) => void;
  updateUser: (user: { name: string; email: string }) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const { mutateAsync: mergeGuest } = useMutation({
    mutationFn: () => mergeGuestData(queryClient),
  });
  useGuestTabSync();
  const checkedRemember = useRef(false);
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    getClientSnapshot,
    getServerSnapshot,
  );

  const clearAccountCaches = useCallback(() => {
    queryClient.removeQueries({ queryKey: queryKeys.cart });
    queryClient.removeQueries({ queryKey: queryKeys.wishlist });
    queryClient.removeQueries({ queryKey: queryKeys.addresses });
    queryClient.removeQueries({ queryKey: queryKeys.allOrders });
  }, [queryClient]);

  const signOut = useCallback(
    ({ silent = false }: { silent?: boolean } = {}) => {
      void authSignOut({ redirect: false }).then(() => {
        clearAccountCaches();
        if (!silent) toast.success("You have been logged out");
        router.push("/login");
        router.refresh();
      });
    },
    [clearAccountCaches, router],
  );

  useEffect(() => {
    if (status !== "authenticated" || checkedRemember.current) return;
    checkedRemember.current = true;
    if (isBrowserSessionOver()) signOut({ silent: true });
  }, [status, signOut]);

  const signIn = useCallback(
    async ({
      remember = true,
      successMessage,
    }: { remember?: boolean; successMessage?: string } = {}) => {
      startBrowserSession(remember);
      // Auth.js just set the cookie, so useSession has to re-read it.
      await update();
      const { merged, notices } = await mergeGuest().catch(() => ({
        merged: false,
        notices: [] as string[],
      }));
      if (successMessage) toast.success(successMessage);
      if (merged)
        toast.success("Items you added as a guest were saved to your account");
      notices.forEach((notice) => toast.warning(notice, { autoClose: 8000 }));
      clearAccountCaches();
    },
    [update, mergeGuest, clearAccountCaches],
  );

  const updateUser = useCallback(
    (user: { name: string; email: string }) => void update(user),
    [update],
  );

  const value = useMemo<AuthContextValue>(() => {
    const u = session?.user;
    return {
      user: u
        ? {
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
          }
        : null,
      userId: u?.id ?? null,
      isReady: mounted && status !== "loading",
      isAuthenticated: mounted && status === "authenticated",
      signIn,
      signOut,
      updateUser,
    };
  }, [session, status, mounted, signIn, signOut, updateUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
