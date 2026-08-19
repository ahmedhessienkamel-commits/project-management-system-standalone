import { describe, expect, it } from "vitest";
import tls from "node:tls";

function smtpCommand(socket: tls.TLSSocket, command: string) {
  return new Promise<string>((resolve, reject) => {
    const onData = (chunk: Buffer) => {
      const text = chunk.toString("utf8");
      if (/^\d{3} /.test(text.trim())) {
        socket.off("data", onData);
        resolve(text);
      }
    };
    socket.on("data", onData);
    socket.once("error", reject);
    socket.write(`${command}\r\n`);
  });
}

describe("Gmail SMTP configuration", () => {
  it("authenticates without sending an email", async () => {
    const username = process.env.GMAIL_USERNAME;
    const password = process.env.GMAIL_APP_PASSWORD;
    if (!username || !password) throw new Error("Gmail SMTP secrets are not configured");

    const socket = tls.connect({ host: "smtp.gmail.com", port: 465, servername: "smtp.gmail.com" });
    try {
      await new Promise<void>((resolve, reject) => {
        socket.once("secureConnect", resolve);
        socket.once("error", reject);
      });
      await smtpCommand(socket, "EHLO erp-backup.local");
      const auth = await smtpCommand(socket, "AUTH LOGIN");
      expect(auth.startsWith("334")).toBe(true);
      const userReply = await smtpCommand(socket, Buffer.from(username).toString("base64"));
      expect(userReply.startsWith("334")).toBe(true);
      const passwordReply = await smtpCommand(socket, Buffer.from(password.replace(/\s/g, "")).toString("base64"));
      expect(passwordReply.startsWith("235")).toBe(true);
      await smtpCommand(socket, "QUIT");
    } finally {
      socket.end();
    }
  }, 20000);
});
