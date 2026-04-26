/**
 * Install a global fetch wrapper that attaches the current Supabase
 * access token to requests for TanStack Start server functions
 * (paths under /_serverFn/). Runs in the browser only.
 */
import { supabase } from "@/integrations/supabase/client";

let installed = false;

export function installAuthFetch() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  const original = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;

      if (url && url.includes("/_serverFn/")) {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (token) {
          const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined));
          if (!headers.has("authorization")) {
            headers.set("authorization", `Bearer ${token}`);
          }
          return original(input, { ...(init ?? {}), headers });
        }
      }
    } catch {
      // fall through to original fetch
    }
    return original(input, init);
  };
}
