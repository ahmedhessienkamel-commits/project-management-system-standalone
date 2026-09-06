export type StatementLedgerRow = {
  id: number;
  document: {
    id?: number | null;
    documentDate?: Date | string | null;
  };
};

function statementDateValue(value: Date | string | null | undefined) {
  if (!value) return Number.POSITIVE_INFINITY;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp;
}

export function sortStatementRowsAscending<T extends StatementLedgerRow>(rows: T[]) {
  return [...rows].sort((left, right) => {
    const dateDifference = statementDateValue(left.document.documentDate) - statementDateValue(right.document.documentDate);
    if (dateDifference !== 0) return dateDifference;
    const documentDifference = (left.document.id ?? 0) - (right.document.id ?? 0);
    return documentDifference !== 0 ? documentDifference : left.id - right.id;
  });
}
