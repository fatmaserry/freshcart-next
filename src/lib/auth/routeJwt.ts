export interface RouteTokenPayload {
  id: string;
  name: string;
  role: string;
  exp?: number;
}

export function decodeRoutePayload(token: string): RouteTokenPayload | null {
  try {
    const part = token.split(".")[1];
    const json = Buffer.from(
      part.replace(/-/g, "+").replace(/_/g, "/"),
      "base64",
    ).toString("utf8");
    return JSON.parse(json) as RouteTokenPayload;
  } catch {
    return null;
  }
}
