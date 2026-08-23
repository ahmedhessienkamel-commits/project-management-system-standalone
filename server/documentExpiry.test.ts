import { describe, expect, it } from "vitest";
import { documentAlertKey, documentExpiryLabel, documentExpiryStage, daysUntilExpiry } from "../shared/documentExpiry";

const today = new Date("2026-08-23T12:00:00Z");

describe("سجل الوثائق والتنبيهات", () => {
  it("يصنف الوثيقة المنتهية والقريبة والسارية وفق تاريخ الانتهاء", () => {
    expect(documentExpiryStage("2026-08-22", 30, today)).toBe("expired");
    expect(documentExpiryStage("2026-08-23", 30, today)).toBe("due_today");
    expect(documentExpiryStage("2026-09-10", 30, today)).toBe("due_soon");
    expect(documentExpiryStage("2026-10-10", 30, today)).toBe("valid");
  });

  it("ينشئ مفتاحًا ثابتًا للتنبيه ويمنع التنبيه للوثيقة السارية", () => {
    expect(documentAlertKey("2026-09-10", 30, today)).toBe("due_soon:2026-09-10");
    expect(documentAlertKey("2026-10-10", 30, today)).toBeNull();
  });

  it("يحسب الأيام المتبقية ويعرض وصفًا عربيًا صحيحًا للحالة", () => {
    expect(daysUntilExpiry("2026-09-10", today)).toBe(18);
    expect(documentExpiryLabel("due_soon", 18)).toBe("تنتهي خلال 18 يوم");
    expect(documentExpiryLabel("expired", -2)).toBe("منتهية منذ 2 يوم");
  });
});
