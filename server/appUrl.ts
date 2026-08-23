import type { Request } from "express";

export function getAppUrl(req?: Pick<Request, "headers" | "protocol">) {
  const configured = process.env.APP_URL?.trim().replace(/\/+$/, "");
  if (configured) return configured;

  const forwardedHost = req?.headers?.["x-forwarded-host"] || req?.headers?.host;
  const forwardedProto = req?.headers?.["x-forwarded-proto"];
  const host = Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost;
  const protocolValue = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto;
  const protocol = protocolValue?.split(",")[0]?.trim() || req?.protocol || "http";
  return host ? `${protocol}://${host}` : "http://localhost:3000";
}
