import { describe, expect, it } from "vitest";
import { payrollRunPaymentStatus } from "../shared/payrollRun";

describe("payrollRunPaymentStatus", () => {
  it("keeps an approved payroll run outstanding before any settlement", () => {
    expect(payrollRunPaymentStatus(1960, 0)).toBe("approved");
  });

  it("marks a run partially paid when only some of its payroll rows are settled", () => {
    expect(payrollRunPaymentStatus(1960, 1200)).toBe("partially_paid");
  });

  it("marks a run paid with a small decimal tolerance after all rows are settled", () => {
    expect(payrollRunPaymentStatus(1960, 1959.996)).toBe("paid");
  });
});
