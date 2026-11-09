export interface ITokenProvider {
  getToken(): Promise<string | null>;
}

// The token lives only in the httpOnly session cookie, which browser JavaScript can't read.
export class BrowserTokenProvider implements ITokenProvider {
  async getToken() {
    return null;
  }
}
