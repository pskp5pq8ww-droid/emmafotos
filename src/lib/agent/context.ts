/**
 * Read-only site context builder for the AI agent.
 * Gathers a compact summary of the site state relevant to the query.
 * Reuses the existing persistence layers — no new write paths, no
 * duplicated business logic.
 */
import { readDB } from "@/lib/db";
import { readInvoices } from "@/lib/db/invoices";
import { studio, services, projects, globalFaq } from "@/lib/public-content";

/** Keyword routing: include heavier context blocks only when relevant. */
function wants(query: string, ...terms: string[]) {
  const q = query.toLowerCase();
  return terms.some((t) => q.includes(t));
}

export async function buildSiteContext(query: string): Promise<string> {
  const db = await readDB();
  const sections: string[] = [];

  // ── Always: studio basics + live counts ──
  sections.push(
    `ESTUDIO: ${studio.name} — ${studio.location}. WhatsApp ${studio.phone}, Instagram ${studio.instagramHandle}.`,
    `ESTADO DEL SITIO: ${db.clients.length} clientes, ${db.galleries.length} galerías (${db.galleries.filter((g) => g.isActive).length} activas), ${db.galleryImages.length} fotos subidas, ${db.reviews.length} reseñas (${db.reviews.filter((r) => !r.approved).length} pendientes de aprobar).`,
  );

  // ── Services (cheap, almost always useful) ──
  sections.push(
    `SERVICIOS: ${services.map((s) => `${s.title} (${s.startingAt})`).join(" · ")}`,
  );

  if (wants(query, "portfolio", "proyecto", "project", "trabajo", "fotos")) {
    sections.push(
      `PORTAFOLIO: ${projects.map((p) => `"${p.title}" — ${p.category}, ${p.location} ${p.year} (${p.images.length} fotos)`).join(" · ")}`,
    );
  }

  if (wants(query, "factur", "invoice", "pago", "revenue", "ingreso", "dinero", "cobr")) {
    const inv = await readInvoices();
    const paid = inv.invoices.filter((i) => i.status === "paid");
    const unpaid = inv.invoices.filter((i) => i.status === "unpaid" || i.status === "sent");
    sections.push(
      `FACTURACIÓN: ${inv.invoices.length} facturas. Pagadas: ${paid.length} ($${paid.reduce((s, i) => s + i.totalDue, 0).toFixed(2)}). Pendientes: ${unpaid.length} ($${unpaid.reduce((s, i) => s + i.totalDue, 0).toFixed(2)}). Próximo número: INV-${String(inv.nextNumber).padStart(3, "0")}.`,
    );
  }

  if (wants(query, "galer", "galler", "cliente", "client", "pin")) {
    const recent = [...db.galleries]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 8)
      .map((g) => {
        const client = db.clients.find((c) => c.id === g.clientId);
        const photos = db.galleryImages.filter((i) => i.galleryId === g.id).length;
        return `"${g.title}" (${client?.name ?? "?"}, ${photos} fotos, ${g.isActive ? "activa" : "inactiva"})`;
      });
    if (recent.length) sections.push(`GALERÍAS RECIENTES: ${recent.join(" · ")}`);
  }

  if (wants(query, "reseñ", "review", "testimon")) {
    const recent = [...db.reviews]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 6)
      .map((r) => `${r.clientName} (${r.rating}★, ${r.approved ? "aprobada" : "pendiente"}): "${r.message.slice(0, 80)}"`);
    if (recent.length) sections.push(`RESEÑAS RECIENTES: ${recent.join(" · ")}`);
  }

  if (wants(query, "faq", "pregunta", "question")) {
    sections.push(`FAQ DEL SITIO: ${globalFaq.map((f) => f.question).join(" · ")}`);
  }

  return sections.join("\n\n");
}
