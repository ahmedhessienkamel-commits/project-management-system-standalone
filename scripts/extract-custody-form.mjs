import fs from "node:fs";
const source = fs.readFileSync("client/src/pages/Operations.tsx", "utf8");
const start = source.indexOf('{tab === "custody"');
const end = source.indexOf('{tab === "custodyStatement"');
console.log(source.slice(start, end));
