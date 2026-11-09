import { getToken } from "next-auth/jwt";

type TokenRequest = Parameters<typeof getToken>[0]["req"];

// The cookie name depends on https, and behind a TLS proxy the app can't tell, so both are tried.
export async function readSessionJwt(req: TokenRequest) {
  const secret = process.env.AUTH_SECRET;
  return (
    (await getToken({ req, secret, secureCookie: true })) ??
    (await getToken({ req, secret, secureCookie: false }))
  );
}
