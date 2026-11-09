"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "./AuthProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
          <ToastContainer position="top-right" autoClose={3000} />
        </QueryProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
