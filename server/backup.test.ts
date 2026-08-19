import { describe, expect, it } from "vitest";
import { validateBackupDocument } from "./routers/backup";

describe("backup document", () => {
  it("accepts the versioned ERP backup envelope", () => {
    const document = validateBackupDocument({
      format: "meta-ads-erp-backup",
      version: 1,
      generatedAt: "2026-08-20T10:00:00.000Z",
      tables: { projects: [{ id: 1, name: "نمار" }] },
      unexpectedSecret: "must-not-be-part-of-the-contract",
    });
    expect(document.format).toBe("meta-ads-erp-backup");
    expect(document.tables.projects).toHaveLength(1);
    expect("unexpectedSecret" in document).toBe(false);
  });

  it("rejects an invalid or unversioned backup", () => {
    expect(() => validateBackupDocument({ format: "other", version: 1, generatedAt: "now", tables: {} })).toThrow();
    expect(() => validateBackupDocument({ format: "meta-ads-erp-backup", version: 0, generatedAt: "now", tables: {} })).toThrow();
  });
});
