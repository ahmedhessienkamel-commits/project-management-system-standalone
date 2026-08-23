import { describe, expect, it } from "vitest";
import { formatMailFrom, getSmtpConfiguration } from "./emailTransport";

describe("SMTP configuration", () => {
  it("uses portable SMTP variables without an outbound connection", () => {
    const config = getSmtpConfiguration({
      SMTP_HOST: "mail.example.test",
      SMTP_PORT: "2525",
      SMTP_SECURE: "false",
      SMTP_USER: "erp@example.test",
      SMTP_PASSWORD: "safe test password",
      SMTP_FROM: "ERP Notifications <erp@example.test>",
    });

    expect(config).toMatchObject({
      host: "mail.example.test",
      port: 2525,
      secure: false,
      auth: { user: "erp@example.test", pass: "safe test password" },
      from: "ERP Notifications <erp@example.test>",
    });
    expect(formatMailFrom("نظام إدارة المشاريع", { SMTP_HOST: "mail.example.test", SMTP_USER: "erp@example.test", SMTP_PASSWORD: "x", SMTP_FROM: "ERP Notifications <erp@example.test>" })).toBe("ERP Notifications <erp@example.test>");
  });

  it("keeps Gmail application-password settings as a compatibility fallback", () => {
    const config = getSmtpConfiguration({
      GMAIL_USERNAME: "erp@example.test",
      GMAIL_APP_PASSWORD: "abcd efgh ijkl mnop",
    });

    expect(config).toMatchObject({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: "erp@example.test", pass: "abcdefghijklmnop" },
      from: "erp@example.test",
    });
  });

  it("rejects incomplete SMTP settings", () => {
    expect(() => getSmtpConfiguration({ SMTP_HOST: "mail.example.test" })).toThrow(/SMTP/);
  });
});
