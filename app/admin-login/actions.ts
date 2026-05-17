"use server";

import { redirect } from "next/navigation";
import {
  createAdminSession,
  verifyAdminCredentials,
} from "@/lib/admin-auth/session";

export type LoginState = {
  error?: string;
};

export async function adminLogin(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const pin = String(formData.get("pin") ?? "");

  if (!(await verifyAdminCredentials(username, pin))) {
    return { error: "Credentials could not be verified." };
  }

  await createAdminSession();
  redirect("/admin");
}
