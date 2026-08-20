import fs from "node:fs";

const path = "client/src/pages/Operations.tsx";
const source = fs.readFileSync(path, "utf8");
const lines = source.split("\n");
const index = lines.findIndex((line) => line.includes('{tab === "custodyStatement" &&') && line.includes("تسجيل حركة عهدة"));
if (index < 0) throw new Error("custody statement block not found");
lines[index] = '    {tab === "custodyStatement" && <CustodyStatementReport data={custodyStatement.data ?? []} employeeOptions={employeeOptions} filter={custodyStatementFilter} onFilterChange={setCustodyStatementFilter} onExport={exportCustodyStatementToExcel} />}';
fs.writeFileSync(path, lines.join("\n"));
