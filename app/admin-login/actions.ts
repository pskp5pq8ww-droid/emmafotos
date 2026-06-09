"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  createAdminSession,
  verifyAdminCredentials,
} from "@/lib/admin-auth/session";
import { checkRateLimit, clearRateLimit } from "@/lib/security/rate-limit";

export type LoginState = {
  error?: string;
};

export async function adminLogin(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0].trim() ??
    headerStore.get("x-real-ip") ??
    "unknown";

  const { allowed, retryAfterSec } = checkRateLimit(`admin-login:${ip}`);
  if (!allowed) {
    return {
      error: `Too many login attempts. Try again in ${retryAfterSec} seconds.`,
    };
  }

  const username = String(formData.get("username") ?? "");
  const pin = String(formData.get("pin") ?? "");

  if (!(await verifyAdminCredentials(username, pin))) {
    return { error: "Credentials could not be verified." };
  }

  clearRateLimit(`admin-login:${ip}`);
  await createAdminSession();
  redirect("/admin");
}
