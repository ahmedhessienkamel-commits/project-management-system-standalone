import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { jwtVerify } from "jose";
import { PASSWORD_SESSION_COOKIE } from "@shared/const";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;
  const passwordToken = opts.req.cookies?.[PASSWORD_SESSION_COOKIE];
  if (passwordToken) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "development-password-secret");
      const verified = await jwtVerify(passwordToken, secret);
      const userId = Number(verified.payload.userId);
      const db = await getDb();
      if (db && Number.isInteger(userId)) user = (await db.select().from(users).where(eq(users.id, userId)).limit(1))[0] || null;
    } catch {
      user = null;
    }
  }
  if (!user) {
    try {
      user = await sdk.authenticateRequest(opts.req);
    } catch (error) {
      // Authentication is optional for public procedures.
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
