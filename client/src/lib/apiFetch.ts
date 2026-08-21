const JSON_CONTENT_TYPES = ["application/json", "application/", "text/json"];

function isJsonResponse(response: Response) {
  const contentType = response.headers.get("content-type")?.toLowerCase() || "";
  return JSON_CONTENT_TYPES.some((type) => contentType.includes(type));
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * tRPC must return JSON. During a dev-server restart, the SPA fallback can
 * briefly answer an API request with index.html. Retry that transient state
 * instead of allowing the JSON parser to surface `Unexpected token '<'`.
 */
export async function fetchApiWithRetry(input: RequestInfo | URL, init?: RequestInit, maxAttempts = 3) {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const response = await globalThis.fetch(input, {
        ...(init ?? {}),
        cache: "no-store",
      });
      const transientHtml = response.ok && !isJsonResponse(response);
      const transientServerError = response.status >= 500 || response.status === 502 || response.status === 503 || response.status === 504;

      if (!transientHtml && !transientServerError) return response;
      lastError = new Error(`API returned an unexpected response (${response.status})`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("API request failed");
    }

    if (attempt < maxAttempts - 1) await wait(120 * (attempt + 1));
  }

  throw lastError || new Error("API request failed");
}

export function responseHasJsonContentType(response: Response) {
  return isJsonResponse(response);
}
