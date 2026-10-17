import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "unsent_session";

function secret() {
  if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be configured in production.");
  }
  return process.env.SESSION_SECRET || "unsent-exe-local-development-secret";
}

export function createSessionValue(nickname = "") {
  const payload = Buffer.from(JSON.stringify({ nickname, createdAt: Date.now() })).toString("base64url");
  const signature = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function readSessionValue(value: string | undefined) {
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { nickname?: string };
  } catch {
    return null;
  }
}
