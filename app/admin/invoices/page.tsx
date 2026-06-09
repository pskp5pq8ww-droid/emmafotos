import Link from "next/link";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-auth/session";
import { readInvoices } from "@/lib/db/invoices";
import { InvoiceListClient } from "@/components/admin/InvoiceListClient";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

function fmtCurrency(n: number) { return `$${n.toFixed(2)}`; }

export default async function InvoicesPage() {
  if (!(await hasAdminSession())) redirect("/admin-login");

  const db = await readInvoices();
  // Newest first
  const invoices = [...db.invoices].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt),
  );

  // Stats
  const total    = invoices.length;
  const paid     = invoices.filter((i) => i.status === "paid").length;
  const unpaid   = invoices.filter((i) => i.status === "unpaid" || i.status === "sent").length;
  const revenue  = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.totalDue, 0);

  return (
    <div>
      {/* ── Page header ── */}
      <div className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>Finance</p>
          <h1 className={styles.title}>Invoice History</h1>
        </div>
        <Link className={styles.primaryButton} href="/admin/invoices/new">
          + New Invoice
        </Link>
      </div>

      {/* ── Stats ── */}
      <section className={styles.metrics}>
        {[
          { label: "Total",   value: total },
          { label: "Paid",    value: paid },
          { label: "Unpaid",  value: unpaid },
          { label: "Revenue (paid)", value: fmtCurrency(revenue) },
        ].map((m) => (
          <div key={m.label} className={styles.metric}>
            <p className={styles.eyebrow}>{m.label}</p>
            <strong style={{ fontSize: typeof m.value === "string" ? 26 : undefined }}>
              {m.value}
            </strong>
          </div>
        ))}
      </section>

      {/* ── History table with search/filter (client component) ── */}
      <InvoiceListClient invoices={invoices} />
    </div>
  );
}
