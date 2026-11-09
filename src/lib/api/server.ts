import "server-only";
import { createApi } from "./index";
import { SessionTokenProvider } from "@/lib/auth/SessionTokenProvider";

export const serverApi = createApi(new SessionTokenProvider());
