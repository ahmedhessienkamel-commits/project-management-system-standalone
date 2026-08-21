export const PUBLIC_AUTH_PATHS = ["/login", "/accept-invitation", "/reset-password"] as const;

export function isPublicAuthPath(pathname: string) {
  return PUBLIC_AUTH_PATHS.includes(pathname as (typeof PUBLIC_AUTH_PATHS)[number]);
}
