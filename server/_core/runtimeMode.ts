export type AuthMode = "local";

export function getAuthMode(): AuthMode {
  return "local";
}

export function isLocalAuthMode() {
  return true;
}
