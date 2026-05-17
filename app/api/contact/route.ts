import { NextResponse } from "next/server";
import { getRequestOrigin } from "@/lib/security/request-origin";

export async function POST(request: Request) {
  const formData = await request.formData();
  const payload = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    type: String(formData.get("type") ?? ""),
    message: String(formData.get("message") ?? ""),
    createdAt: new Date().toISOString(),
  };

  console.info("[contact]", payload);
  return NextResponse.redirect(new URL("/contact?sent=1", getRequestOrigin(request)), 303);
}
