"use server";

import { serverApi } from "@/lib/api/server";
import { runAction } from "@/lib/actions/result";
import { unstable_update } from "@/auth";
import type { ChangePasswordPayload, UpdateMePayload } from "@/types/api";

// The new Route token belongs in the encrypted session and must never reach the browser.
export const changePasswordAction = async (payload: ChangePasswordPayload) =>
  runAction(async () => {
    const res = await serverApi.users.changePassword(payload);
    await unstable_update({
      token: res.token,
      name: res.user.name,
      email: res.user.email,
    } as never);
    return { message: res.message, user: res.user };
  });

export const updateMeAction = async (payload: Partial<UpdateMePayload>) =>
  runAction(async () => {
    const res = await serverApi.users.updateMe(payload);
    // The API never returns the phone, so the session is its only home.
    await unstable_update({
      name: res.user.name,
      email: res.user.email,
      phone: payload.phone,
    } as never);
    return res;
  });
