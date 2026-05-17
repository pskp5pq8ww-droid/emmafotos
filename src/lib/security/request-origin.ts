export function getRequestOrigin(request: Request) {
  const origin = request.headers.get("origin");

  if (origin) {
    return origin;
  }

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const protocol =
    request.headers.get("x-forwarded-proto") ??
    (host?.startsWith("localhost") || host?.startsWith("127.0.0.1")
      ? "http"
      : "https");

  return host ? `${protocol}://${host}` : request.url;
}
