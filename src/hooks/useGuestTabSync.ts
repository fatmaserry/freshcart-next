"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { guestCart, guestWishlist } from "@/lib/guest/GuestStore";
import { cartKey, wishlistKey } from "@/lib/query/cartQueries";

export function useGuestTabSync() {
  const qc = useQueryClient();

  useEffect(() => {
    const stopCart = guestCart.onExternalChange(() =>
      qc.invalidateQueries({ queryKey: cartKey(false) }),
    );
    const stopWishlist = guestWishlist.onExternalChange(() =>
      qc.invalidateQueries({ queryKey: wishlistKey(false) }),
    );
    return () => {
      stopCart();
      stopWishlist();
    };
  }, [qc]);
}
