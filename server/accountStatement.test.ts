import { describe, expect, it } from "vitest";
import { sortStatementRowsAscending } from "../shared/accountStatement";

describe("account statement ordering", () => {
  it("sorts rows by real transaction date and then by document and line id", () => {
    const rows = [
      { id: 4, document: { id: 20, documentDate: "2026-09-12" } },
      { id: 3, document: { id: 19, documentDate: "2026-09-12" } },
      { id: 2, document: { id: 18, documentDate: "2026-01-05" } },
      { id: 1, document: { id: 17, documentDate: "2025-12-31" } },
    ];

    expect(sortStatementRowsAscending(rows).map((row) => row.id)).toEqual([1, 2, 3, 4]);
  });

  it("keeps undated rows at the bottom without mutating the source array", () => {
    const rows = [
      { id: 2, document: { id: 2, documentDate: null } },
      { id: 1, document: { id: 1, documentDate: "2026-01-01" } },
    ];

    const sorted = sortStatementRowsAscending(rows);
    expect(sorted.map((row) => row.id)).toEqual([1, 2]);
    expect(rows.map((row) => row.id)).toEqual([2, 1]);
  });
});
