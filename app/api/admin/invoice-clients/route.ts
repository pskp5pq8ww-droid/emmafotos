import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth/session";
import { readInvoiceClients } from "@/lib/db/invoice-clients";

/**
 * GET /api/admin/invoice-clients?q=<search>
 * Returns up to 8 invoice clients matching the query string.
 * Admin session required.
 */
export async function GET(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();

  const db = await readInvoiceClients();

  let results = db.clients;

  if (q.length > 0) {
    results = db.clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q) ||
        (c.phone ?? "").toLowerCase().includes(q),
    );
  }

  // Sort: most recently used first, then alphabetically
  results = [...results].sort((a, b) => {
    const lastA = a.lastUsedAt ?? a.createdAt;
    const lastB = b.lastUsedAt ?? b.createdAt;
    return lastB.localeCompare(lastA);
  });

  return NextResponse.json({ clients: results.slice(0, 8) });
}
