import type { ITokenProvider } from "@/lib/auth/TokenProvider";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }

  get isUnauthorized() {
    return this.status === 401;
  }
}

const REQUEST_TIMEOUT_MS = 20_000;

type Query = Record<string, string | number | undefined | null>;

interface RequestOptions {
  query?: Query;
  body?: unknown;
  auth?: boolean;
}

export class HttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly tokens: ITokenProvider,
  ) {}

  get<T>(path: string, options?: Omit<RequestOptions, "body">) {
    return this.request<T>("GET", path, options);
  }

  post<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "body">,
  ) {
    return this.request<T>("POST", path, { ...options, body });
  }

  put<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "body">) {
    return this.request<T>("PUT", path, { ...options, body });
  }

  delete<T>(path: string, options?: Omit<RequestOptions, "body">) {
    return this.request<T>("DELETE", path, options);
  }

  private buildUrl(path: string, query?: Query) {
    // Our own /api routes use a relative base URL.
    const url = new URL(
      `${this.baseUrl}${path}`,
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost",
    );
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.set(key, String(value));
        }
      });
    }
    return url.toString();
  }

  private async request<T>(
    method: string,
    path: string,
    { query, body, auth = false }: RequestOptions = {},
  ): Promise<T> {
    // Only with a body: on a GET this header would force a CORS preflight.
    const headers: Record<string, string> =
      body !== undefined ? { "Content-Type": "application/json" } : {};
    if (auth) {
      const token = await this.tokens.getToken();
      if (!token) throw new ApiError("Please log in to continue", 401);
      headers.token = token;
    }

    const res = await this.send(this.buildUrl(path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new ApiError(
        HttpClient.extractMessage(data) ?? res.statusText,
        res.status,
        data,
      );
    }
    return data as T;
  }

  private async send(url: string, init: RequestInit) {
    try {
      return await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch {
      throw new ApiError(
        "We couldn't reach the server. Please try again.",
        503,
      );
    }
  }

  private static extractMessage(data: unknown): string | undefined {
    if (!data || typeof data !== "object") return undefined;
    const d = data as { message?: string; errors?: { msg?: string } };
    if (d.errors?.msg) return d.errors.msg;
    return d.message;
  }
}
