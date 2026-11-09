import type { UseMutationOptions } from "@tanstack/react-query";

export type MutationOpts<TData, TVars, TCtx = unknown> = Omit<
  UseMutationOptions<TData, Error, TVars, TCtx>,
  "mutationFn"
>;
