import { safeStorage } from "@/lib/safeStorage";

const REMEMBER_KEY = "freshcart:remember";

// A cookie with no expiry is shared by every tab and dropped when the browser closes,
// which is the lifetime "Keep me signed in" being unchecked promises. sessionStorage is per tab.
const ALIVE_COOKIE = "freshcart-alive";

export function startBrowserSession(remember: boolean) {
  safeStorage.set(REMEMBER_KEY, remember ? "1" : "0");
  document.cookie = `${ALIVE_COOKIE}=1; path=/; SameSite=Lax`;
}

export function isBrowserSessionOver() {
  const alive = document.cookie
    .split("; ")
    .some((c) => c.startsWith(`${ALIVE_COOKIE}=`));
  return safeStorage.get(REMEMBER_KEY) === "0" && !alive;
}
