export type DocumentExpiryStage = "expired" | "due_today" | "due_soon" | "valid";

function asUtcDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(`${value}T00:00:00Z`);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function daysUntilExpiry(expiryDate: Date | string, now: Date = new Date()) {
  const end = asUtcDate(expiryDate).getTime();
  const today = asUtcDate(now).getTime();
  return Math.round((end - today) / 86_400_000);
}

export function documentExpiryStage(expiryDate: Date | string, reminderDays: number, now: Date = new Date()): DocumentExpiryStage {
  const remaining = daysUntilExpiry(expiryDate, now);
  if (remaining < 0) return "expired";
  if (remaining === 0) return "due_today";
  if (remaining <= Math.max(0, reminderDays)) return "due_soon";
  return "valid";
}

export function documentAlertKey(expiryDate: Date | string, reminderDays: number, now: Date = new Date()) {
  const stage = documentExpiryStage(expiryDate, reminderDays, now);
  return stage === "valid" ? null : `${stage}:${asUtcDate(expiryDate).toISOString().slice(0, 10)}`;
}

export function documentExpiryLabel(stage: DocumentExpiryStage, remainingDays: number) {
  if (stage === "expired") return `منتهية منذ ${Math.abs(remainingDays)} يوم`;
  if (stage === "due_today") return "تنتهي اليوم";
  if (stage === "due_soon") return `تنتهي خلال ${remainingDays} يوم`;
  return `سارية لمدة ${remainingDays} يوم`;
}
