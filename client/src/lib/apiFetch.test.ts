import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchApiWithRetry } from "./apiFetch";

describe("fetchApiWithRetry", () => {
  afterEach(() => vi.restoreAllMocks());

  it("retries an HTML SPA fallback and returns the later JSON response", async () => {
    const html = new Response("<!doctype html><html></html>", {
      status: 200,
      headers: { "content-type": "text/html" },
    });
    const json = new Response('{"result":{"data":{"json":null}}}', {
      status: 200,
      headers: { "content-type": "application/json" },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(html).mockResolvedValueOnce(json);

    const response = await fetchApiWithRetry("/api/trpc/auth.me", undefined, 2);

    expect(response.headers.get("content-type")).toContain("application/json");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("returns a normal JSON error response without retrying", async () => {
    const response = new Response('{"error":{"message":"Unauthorized"}}', {
      status: 401,
      headers: { "content-type": "application/json" },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(response);

    const result = await fetchApiWithRetry("/api/trpc/auth.me", undefined, 3);

    expect(result.status).toBe(401);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
