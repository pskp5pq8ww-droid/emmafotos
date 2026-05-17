import crypto from "node:crypto";
import { cookies } from "next/headers";
import { ADMIN_PIN_HASH, ADMIN_SESSION_COOKIE, ADMIN_USERNAME } from "./config";
import { readDB } from "@/lib/db";
import { verifyPin } from "@/lib/security/pin";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function sign(payload: string, pinHash: string) {
  return crypto.createHash("sha256").update(`${payload}.${pinHash}`).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export async function getAdminPinHash() {
  const db = await readDB();
  return db.settings?.adminPinHash || ADMIN_PIN_HASH;
}

export async function verifyAdminCredentials(username: string, pin: string) {
  if (username.trim().toLowerCase() !== ADMIN_USERNAME) {
    return false;
  }

  return verifyPin(pin, await getAdminPinHash());
}

export async function createAdminSession() {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = String(expires);
  const token = `${payload}.${sign(payload, await getAdminPinHash())}`;
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expires),
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function hasAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return false;
  }

  const [payload, signature] = token.split(".");
  const expires = Number(payload);

  if (!payload || !signature || Number.isNaN(expires) || expires < Date.now()) {
    return false;
  }

  const expected = sign(payload, await getAdminPinHash());
  return safeEqual(signature, expected);
}
