export type PayrollRunPaymentStatus = "approved" | "partially_paid" | "paid";

export function payrollRunPaymentStatus(totalAmount: number, paidAmount: number): PayrollRunPaymentStatus {
  const total = Math.max(Number(totalAmount) || 0, 0);
  const paid = Math.max(Number(paidAmount) || 0, 0);
  if (total > 0 && paid >= total - 0.005) return "paid";
  if (paid > 0) return "partially_paid";
  return "approved";
}
