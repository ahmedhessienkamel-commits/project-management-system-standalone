import { describe, expect, it } from "vitest";
import { parseDraft, serializeDraft } from "./useDraft";

describe("draft serialization", () => {
  it("serializes and restores structured form data", () => {
    const value = { projectId: "12", amount: "4500", lines: [{ accountId: 7 }] };
    expect(parseDraft(serializeDraft(value), {})).toEqual(value);
  });

  it("falls back safely for missing or corrupted data", () => {
    const fallback = { amount: "" };
    expect(parseDraft(null, fallback)).toEqual(fallback);
    expect(parseDraft("not-json", fallback)).toEqual(fallback);
  });
});
