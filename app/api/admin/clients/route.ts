import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { updateDB } from "@/lib/db";
import { hasAdminSession } from "@/lib/admin-auth/session";
import { hashPin, isValidClientPin } from "@/lib/security/pin";

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    name?: string;
    email?: string;
    username?: string;
    pin?: string;
  };

  if (!body.name || !body.pin || !isValidClientPin(body.pin)) {
    return NextResponse.json({ error: "Invalid client" }, { status: 400 });
  }

  const client = {
    id: randomUUID(),
    name: body.name,
    email: body.email ?? "",
    username: body.username || undefined,
    pinHash: await hashPin(body.pin),
    createdAt: new Date().toISOString(),
  };

  await updateDB((db) => ({ ...db, clients: [...db.clients, client] }));
  return NextResponse.json({ client });
}

export async function DELETE(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { id?: string };

  await updateDB((db) => ({
    ...db,
    clients: db.clients.filter((client) => client.id !== body.id),
  }));

  return NextResponse.json({ ok: true });
}
