import { describe, expect, it } from "vitest";
import { isPublicAuthPath } from "./authRoutes";

describe("public authentication routes", () => {
  it("keeps invitation activation independent from OAuth", () => {
    expect(isPublicAuthPath("/accept-invitation")).toBe(true);
    expect(isPublicAuthPath("/login")).toBe(true);
    expect(isPublicAuthPath("/reset-password")).toBe(true);
  });

  it("does not classify protected application routes as public", () => {
    expect(isPublicAuthPath("/")).toBe(false);
    expect(isPublicAuthPath("/projects")).toBe(false);
    expect(isPublicAuthPath("/inventory")).toBe(false);
  });
});
