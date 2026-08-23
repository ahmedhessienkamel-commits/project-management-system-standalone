import { runDocumentExpiryAlertScan } from "../documentExpiryService";

async function main() {
  try {
    const result = await runDocumentExpiryAlertScan();
    console.log(JSON.stringify({ job: "document-expiry-check", ok: true, ...result }));
    process.exit(0);
  } catch (error) {
    console.error(JSON.stringify({ job: "document-expiry-check", ok: false, error: error instanceof Error ? error.message : "unknown" }));
    process.exit(1);
  }
}

void main();
