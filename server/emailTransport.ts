import nodemailer from "nodemailer";

export type SmtpConfiguration = {
  host: string;
  port: number;
  secure: boolean;
  auth: { user: string; pass: string };
  from: string;
};

function readBoolean(value: string | undefined, fallback: boolean) {
  if (value === undefined || value.trim() === "") return fallback;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

export function getSmtpConfiguration(env: NodeJS.ProcessEnv = process.env): SmtpConfiguration {
  const usesLegacyGmail = !env.SMTP_HOST && Boolean(env.GMAIL_USERNAME);
  const host = env.SMTP_HOST?.trim() || (usesLegacyGmail ? "smtp.gmail.com" : "");
  const user = env.SMTP_USER?.trim() || env.GMAIL_USERNAME?.trim() || "";
  const passwordSource = env.SMTP_PASSWORD ?? env.GMAIL_APP_PASSWORD ?? "";
  const portValue = env.SMTP_PORT?.trim() || (usesLegacyGmail ? "465" : "587");
  const port = Number(portValue);
  const from = env.SMTP_FROM?.trim() || user;

  if (!host || !user || !passwordSource || !from) {
    throw new Error("إعدادات SMTP غير مكتملة. عيّن SMTP_HOST وSMTP_USER وSMTP_PASSWORD وSMTP_FROM.");
  }
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("SMTP_PORT يجب أن يكون رقم منفذ صحيحًا بين 1 و65535.");
  }

  return {
    host,
    port,
    secure: readBoolean(env.SMTP_SECURE, port === 465),
    auth: {
      user,
      pass: usesLegacyGmail ? passwordSource.replace(/\s/g, "") : passwordSource,
    },
    from,
  };
}

export function getMailer(env: NodeJS.ProcessEnv = process.env) {
  const config = getSmtpConfiguration(env);
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
  });
}

export function getMailFrom(env: NodeJS.ProcessEnv = process.env) {
  return getSmtpConfiguration(env).from;
}

export function formatMailFrom(displayName: string, env: NodeJS.ProcessEnv = process.env) {
  const from = getMailFrom(env);
  return from.includes("<") ? from : `${displayName} <${from}>`;
}
