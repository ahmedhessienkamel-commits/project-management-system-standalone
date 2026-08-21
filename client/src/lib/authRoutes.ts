export const PUBLIC_AUTH_PATHS = ["/login", "/accept-invitation", "/reset-password"] as const;

export function isPublicAuthPath(pathname: string, search = "") {
  if (PUBLIC_AUTH_PATHS.includes(pathname as (typeof PUBLIC_AUTH_PATHS)[number])) return true;
  const params = new URLSearchParams(search);
  return Boolean(params.get("invite") || params.get("token")) && pathname === "/";
}
