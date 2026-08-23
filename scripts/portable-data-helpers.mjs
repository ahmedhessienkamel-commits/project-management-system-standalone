export const portableExcludedTables = new Set(["passwordResetTokens", "userInvitations", "__drizzle_migrations"]);

export function isPortableDataDocument(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      value.format === "erp-portable-data" &&
      value.version === 1 &&
      value.tables &&
      typeof value.tables === "object" &&
      !Array.isArray(value.tables),
  );
}

export function normalizeMysqlValue(value, columnType = "") {
  if (value === undefined) return null;
  const normalizedType = columnType.toLowerCase();
  if (value !== null && normalizedType.startsWith("date") && !normalizedType.startsWith("datetime")) {
    return String(value).slice(0, 10);
  }
  if (value !== null && (normalizedType.startsWith("datetime") || normalizedType.startsWith("timestamp"))) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString().slice(0, 19).replace("T", " ");
  }
  if (value !== null && typeof value === "object" && normalizedType.startsWith("json")) {
    return JSON.stringify(value);
  }
  return value;
}

export function importableTableEntries(tables) {
  return Object.entries(tables)
    .filter(([name, rows]) => !portableExcludedTables.has(name) && Array.isArray(rows))
    .sort(([left], [right]) => left.localeCompare(right));
}
