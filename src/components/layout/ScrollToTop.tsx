"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Next only scrolls when the new page's top is outside the viewport, so with a
// tall header a link clicked after scrolling a little keeps the old offset.
export function ScrollToTop() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
