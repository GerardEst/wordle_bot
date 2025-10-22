function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (origin === "https://mooot.cat") return true;
  if (origin.endsWith(".vercel.app")) return true;
  if (origin.startsWith("http://localhost")) return true;
  return false;
}

export function cors(response: Response, req?: Request): Response {
  const headers = new Headers(response.headers);
  const requestOrigin = req?.headers.get("origin") ?? null;

  // If the origin is allowed, echo it back; otherwise fall back to prod domain
  const allowOrigin = isAllowedOrigin(requestOrigin)
    ? (requestOrigin as string)
    : "https://mooot.cat";

  headers.set("Access-Control-Allow-Origin", allowOrigin);
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Access-Control-Max-Age", "86400");
  headers.append("Vary", "Origin");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
