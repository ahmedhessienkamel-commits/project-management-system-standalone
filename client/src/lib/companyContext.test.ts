import { describe, expect, it } from "vitest";

type Company = { id: number; legalName: string; isActive: number };

function selectActiveCompany(companies: Company[], requestedId: number | null, assignedIds: number[] | null) {
  const visible = companies.filter((company) => company.isActive === 1 && (!assignedIds || assignedIds.includes(company.id)));
  return visible.find((company) => company.id === requestedId) ?? visible[0] ?? null;
}

describe("multi-company context", () => {
  const companies = [
    { id: 1, legalName: "الشركة الأولى", isActive: 1 },
    { id: 2, legalName: "الشركة الثانية", isActive: 1 },
    { id: 3, legalName: "شركة متوقفة", isActive: 0 },
  ];

  it("keeps an administrator inside the requested active company", () => {
    expect(selectActiveCompany(companies, 2, null)?.id).toBe(2);
  });

  it("falls back to an assigned company when the requested company is not allowed", () => {
    expect(selectActiveCompany(companies, 2, [1])?.id).toBe(1);
  });

  it("does not expose inactive or unassigned companies", () => {
    expect(selectActiveCompany(companies, 3, [1, 2])?.id).toBe(1);
    expect(selectActiveCompany(companies, 3, [3])).toBeNull();
  });
});
