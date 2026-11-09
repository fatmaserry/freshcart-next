"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query/keys";
import { getErrorMessage } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import type { AddressPayload } from "@/types/api";
import { unwrap } from "@/lib/actions/result";
import {
  addAddressAction,
  getAddressAction,
  getAddressesAction,
  removeAddressAction,
} from "@/actions/address.actions";

export function useAddresses() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: queryKeys.addresses,
    queryFn: () => unwrap(getAddressesAction()),
    enabled: isAuthenticated,
  });
}

export function useAddAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddressPayload) => unwrap(addAddressAction(payload)),
    onSuccess: (res) => {
      qc.setQueryData(queryKeys.addresses, res);
      toast.success("Address saved");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

// The API can't edit an address, so the new version is saved before the old one is deleted.
export function useReplaceAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: AddressPayload;
    }) => {
      await unwrap(addAddressAction(payload));
      return unwrap(removeAddressAction(id));
    },
    onSuccess: (res) => {
      qc.setQueryData(queryKeys.addresses, res);
      toast.success("Address updated");
    },
    onError: (e) => {
      qc.invalidateQueries({ queryKey: queryKeys.addresses });
      toast.error(getErrorMessage(e));
    },
  });
}

export function useRemoveAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unwrap(removeAddressAction(id)),
    onSuccess: (res) => {
      qc.setQueryData(queryKeys.addresses, res);
      toast.success("Address removed");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

export function useOrders() {
  const { userId } = useAuth();
  return useQuery({
    queryKey: queryKeys.orders(userId ?? ""),
    queryFn: () => api.orders.getUserOrders(userId!),
    enabled: !!userId,
    select: (orders) =>
      // A product deleted from the catalog comes back as null on old orders.
      orders.map((o) => ({
        ...o,
        cartItems: o.cartItems.filter((i) => i.product),
      })),
  });
}

export function useAddress(id: string) {
  return useQuery({
    queryKey: [...queryKeys.addresses, id],
    queryFn: () => unwrap(getAddressAction(id)),
  });
}
