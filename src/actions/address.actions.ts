"use server";

import { serverApi } from "@/lib/api/server";
import { runAction } from "@/lib/actions/result";
import { assertId } from "@/lib/actions/validate";
import type { AddressPayload } from "@/types/api";

export const getAddressesAction = async () =>
  runAction(() => serverApi.addresses.getAll());

export const getAddressAction = async (id: string) =>
  runAction(() => {
    assertId(id);
    return serverApi.addresses.getById(id);
  });

export const addAddressAction = async (payload: AddressPayload) =>
  runAction(() => serverApi.addresses.add(payload));

export const removeAddressAction = async (id: string) =>
  runAction(() => {
    assertId(id);
    return serverApi.addresses.remove(id);
  });
