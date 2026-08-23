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
  if (value !== null && typeof value === "object" && columnType.toLowerCase().startsWith("json")) {
    return JSON.stringify(value);
  }
  return value;
}

export function importableTableEntries(tables) {
  return Object.entries(tables)
    .filter(([name, rows]) => !portableExcludedTables.has(name) && Array.isArray(rows))
    .sort(([left], [right]) => left.localeCompare(right));
}
