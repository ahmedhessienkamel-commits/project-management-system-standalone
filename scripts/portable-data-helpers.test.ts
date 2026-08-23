import { describe, expect, it } from "vitest";
import { importableTableEntries, isPortableDataDocument, normalizeMysqlValue } from "./portable-data-helpers.mjs";

describe("portable data helpers", () => {
  it("accepts only the expected portable document envelope", () => {
    expect(isPortableDataDocument({ format: "erp-portable-data", version: 1, tables: {} })).toBe(true);
    expect(isPortableDataDocument({ format: "other", version: 1, tables: {} })).toBe(false);
    expect(isPortableDataDocument({ format: "erp-portable-data", version: 2, tables: [] })).toBe(false);
  });

  it("excludes secrets, invitation records, and migration history from imports", () => {
    const names = importableTableEntries({
      users: [],
      passwordResetTokens: [],
      userInvitations: [],
      __drizzle_migrations: [],
      projects: [],
    }).map(([name]) => name);
    expect(names).toEqual(["projects", "users"]);
  });

  it("serializes structured values only for JSON columns", () => {
    expect(normalizeMysqlValue({ amount: 10 }, "json")).toBe('{"amount":10}');
    expect(normalizeMysqlValue("2026-08-23", "date")).toBe("2026-08-23");
  });
});
