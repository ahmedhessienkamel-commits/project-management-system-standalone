export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Standalone deployments use the password screen and do not create an OAuth
// redirect URL. Keeping this function preserves existing callers safely.
export const startLogin = () => {
  window.location.assign("/login");
};
