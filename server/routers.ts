import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { getDb } from "./db";
import { users, userInvitations } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { SignJWT } from "jose";
import { PASSWORD_SESSION_COOKIE } from "@shared/const";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { erpRouter } from "./routers/erp";
import { backupRouter } from "./routers/backup";
import { passwordResetTokens } from "../drizzle/schema";
import { sendPasswordResetEmail } from "./email";

const passwordSecret = () => new TextEncoder().encode(process.env.JWT_SECRET || "development-password-secret");
const hashPassword = (password: string) => { const salt = randomBytes(16).toString("hex"); return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`; };
const verifyPassword = (password: string, stored: string | null) => { if (!stored) return false; const [salt, digest] = stored.split(":"); if (!salt || !digest) return false; const actual = scryptSync(password, salt, 64); const expected = Buffer.from(digest, "hex"); return actual.length === expected.length && timingSafeEqual(actual, expected); };
const createPasswordSession = (userId: number) => new SignJWT({ userId }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("30d").sign(passwordSecret());

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  erp: erpRouter,
  backup: backupRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      ctx.res.clearCookie(PASSWORD_SESSION_COOKIE, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    requestPasswordReset: publicProcedure.input(z.object({ email: z.string().email() })).mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: true } as const;
      const email = input.email.trim().toLowerCase();
      const user = (await db.select().from(users).where(eq(users.email, email)).limit(1))[0];
      if (user?.passwordHash && user.email) {
        const rawToken = randomBytes(32).toString("hex");
        const tokenHash = createHash("sha256").update(rawToken).digest("hex");
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
        await db.insert(passwordResetTokens).values({ userId: user.id, tokenHash, expiresAt });
        const forwardedHost = ctx.req.headers["x-forwarded-host"] || ctx.req.headers.host || "metaadscntr-8ymftbnn.manus.space";
        const forwardedProto = ctx.req.headers["x-forwarded-proto"] || "https";
        const host = Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost;
        const protocol = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto;
        const resetUrl = `${protocol}://${host}/reset-password?token=${rawToken}`;
        try { await sendPasswordResetEmail({ to: user.email, recipientName: user.name, resetUrl, expiresAt }); } catch (error) { console.error("[PasswordReset] Email delivery failed", error); }
      }
      return { success: true } as const;
    }),
    resetPassword: publicProcedure.input(z.object({ token: z.string().min(32), password: z.string().min(8) })).mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "قاعدة البيانات غير متاحة" });
      const tokenHash = createHash("sha256").update(input.token).digest("hex");
      const reset = (await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.tokenHash, tokenHash)).limit(1))[0];
      if (!reset || reset.usedAt || reset.expiresAt.getTime() < Date.now()) throw new TRPCError({ code: "BAD_REQUEST", message: "رابط الاستعادة غير صالح أو منتهي" });
      await db.update(users).set({ passwordHash: hashPassword(input.password) }).where(eq(users.id, reset.userId));
      await db.update(passwordResetTokens).set({ usedAt: new Date() }).where(eq(passwordResetTokens.id, reset.id));
      return { success: true } as const;
    }),
    setPassword: protectedProcedure.input(z.object({ password: z.string().min(8) })).mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db || !ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      await db.update(users).set({ passwordHash: hashPassword(input.password), loginMethod: ctx.user.loginMethod || "password" }).where(eq(users.id, ctx.user.id));
      return { success: true } as const;
    }),
    passwordLogin: publicProcedure.input(z.object({ email: z.string().email(), password: z.string().min(8) })).mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "قاعدة البيانات غير متاحة" });
      const user = (await db.select().from(users).where(eq(users.email, input.email.trim().toLowerCase())).limit(1))[0];
      if (!user || !verifyPassword(input.password, user.passwordHash)) throw new TRPCError({ code: "UNAUTHORIZED", message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, user.id));
      const token = await createPasswordSession(user.id);
      ctx.res.cookie(PASSWORD_SESSION_COOKIE, token, { ...getSessionCookieOptions(ctx.req), sameSite: "lax", maxAge: 30 * 24 * 60 * 60 * 1000 });
      return { success: true, sessionToken: token } as const;
    }),
    invitationDetails: publicProcedure.input(z.object({ token: z.string().min(20) })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "قاعدة البيانات غير متاحة" });
      const invitation = (await db.select({ email: userInvitations.email, status: userInvitations.status, expiresAt: userInvitations.expiresAt }).from(userInvitations).where(eq(userInvitations.token, input.token)).limit(1))[0];
      if (!invitation || invitation.status !== "pending" || (invitation.expiresAt && invitation.expiresAt.getTime() < Date.now())) throw new TRPCError({ code: "BAD_REQUEST", message: "رابط الدعوة غير صالح أو منتهي" });
      return { email: invitation.email } as const;
    }),
    acceptInvitation: publicProcedure.input(z.object({ token: z.string().min(20), password: z.string().min(8) })).mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "قاعدة البيانات غير متاحة" });
      const invitation = (await db.select().from(userInvitations).where(eq(userInvitations.token, input.token)).limit(1))[0];
      if (!invitation || invitation.status !== "pending" || (invitation.expiresAt && invitation.expiresAt.getTime() < Date.now())) throw new TRPCError({ code: "BAD_REQUEST", message: "رابط الدعوة غير صالح أو منتهي" });
      const email = invitation.email.trim().toLowerCase();
      const existing = (await db.select().from(users).where(eq(users.email, email)).limit(1))[0];
      let userId: number;
      const passwordHash = hashPassword(input.password);
      if (existing) { userId = existing.id; await db.update(users).set({ name: invitation.name || existing.name, role: invitation.role, jobTitle: invitation.jobTitle, passwordHash, lastSignedIn: new Date() }).where(eq(users.id, existing.id)); }
      else { const result = await db.insert(users).values({ openId: `password-${randomUUID()}`, name: invitation.name, email, loginMethod: "password", role: invitation.role, jobTitle: invitation.jobTitle, passwordHash, lastSignedIn: new Date() }); userId = Number(result[0].insertId); }
      await db.update(userInvitations).set({ status: "accepted" }).where(eq(userInvitations.id, invitation.id));
      const token = await createPasswordSession(userId);
      ctx.res.cookie(PASSWORD_SESSION_COOKIE, token, { ...getSessionCookieOptions(ctx.req), sameSite: "lax", maxAge: 30 * 24 * 60 * 60 * 1000 });
      return { success: true, sessionToken: token } as const;
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
