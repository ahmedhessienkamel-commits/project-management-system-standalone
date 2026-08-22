const operationalRoles = new Set(["procurement_manager", "site_worker"]);

export function defaultRouteForRole(role?: string | null) {
  return operationalRoles.has(role || "") ? "/inventory" : "/";
}

export function canAccessRoute(role: string | null | undefined, location: string) {
  if (!operationalRoles.has(role || "")) return true;
  const url = new URL(location, "https://erp.local");
  const sharedPaths = new Set(["/login", "/accept-invitation", "/reset-password", "/account-security"]);
  if (sharedPaths.has(url.pathname)) return true;
  if (url.pathname === "/inventory" || url.pathname === "/my-requests") return true;
  return url.pathname === "/operations" && url.searchParams.get("tab") === "procurement";
}

export function isOperationalOnlyRole(role?: string | null) {
  return operationalRoles.has(role || "");
}

export function canDeleteOwnerManagedDocument(role?: string | null) {
  return role === "admin";
}
