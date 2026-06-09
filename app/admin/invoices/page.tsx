import Link from "next/link";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-auth/session";
import { readInvoices } from "@/lib/db/invoices";
import { deleteInvoiceAction, duplicateInvoiceAction, markPaidAction, markUnpaidAction } from "./actions";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

function fmtCurrency(n: number) {
  return `$${n.toFixed(2)}`;
}

function fmtDate(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "paid"   ? styles.badgePaid   :
    status === "unpaid" ? styles.badgeUnpaid :
    status === "sent"   ? styles.badgeSent   :
    styles.badgeDraft;
  return <span className={`${styles.badge} ${cls}`}>{status}</span>;
}

export default async function InvoicesPage() {
  if (!(await hasAdminSession())) redirect("/admin-login");

  const db = await readInvoices();
  const invoices = [...db.invoices].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt),
  );

  // Stats
  const total = invoices.length;
  const paid = invoices.filter((i) => i.status === "paid").length;
  const unpaid = invoices.filter((i) => i.status === "unpaid" || i.status === "sent").length;
  const revenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.totalDue, 0);

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>Finance</p>
          <h1 className={styles.title}>Invoices</h1>
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
          { label: "Revenue", value: fmtCurrency(revenue) },
        ].map((m) => (
          <div key={m.label} className={styles.metric}>
            <p className={styles.eyebrow}>{m.label}</p>
            <strong style={{ fontSize: typeof m.value === "string" ? 28 : undefined }}>
              {m.value}
            </strong>
          </div>
        ))}
      </section>

      {/* ── Table ── */}
      <div className={styles.panel}>
        {invoices.length === 0 ? (
          <div className={styles.panelPad} style={{ color: "#A1A1AA", fontSize: 14 }}>
            No invoices yet.{" "}
            <Link href="/admin/invoices/new" style={{ color: "#E8C878" }}>
              Create your first invoice →
            </Link>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Client</th>
                <th>Issued</th>
                <th>Due</th>
                <th>Amount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td>
                    <Link
                      href={`/admin/invoices/${inv.id}`}
                      style={{ color: "#E8C878", fontWeight: 500 }}
                    >
                      {inv.invoiceNumber}
                    </Link>
                  </td>
                  <td>
                    {inv.clientName}
                    {inv.clientEmail && (
                      <>
                        <br />
                        <span className={styles.muted}>{inv.clientEmail}</span>
                      </>
                    )}
                  </td>
                  <td>{fmtDate(inv.issueDate)}</td>
                  <td>{fmtDate(inv.dueDate)}</td>
                  <td style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>
                    {fmtCurrency(inv.totalDue)}
                  </td>
                  <td><StatusBadge status={inv.status} /></td>
                  <td>
                    <div className={styles.inlineActions}>
                      <Link
                        href={`/admin/invoices/${inv.id}`}
                        className={styles.ghostButton}
                        style={{ minHeight: 30, fontSize: 9.5, paddingInline: 12 }}
                      >
                        Edit
                      </Link>
                      {inv.status !== "paid" ? (
                        <form action={markPaidAction} style={{ display: "contents" }}>
                          <input type="hidden" name="id" value={inv.id} />
                          <button
                            type="submit"
                            className={styles.successButton}
                            style={{ minHeight: 30, fontSize: 9.5, paddingInline: 12 }}
                          >
                            Mark Paid
                          </button>
                        </form>
                      ) : (
                        <form action={markUnpaidAction} style={{ display: "contents" }}>
                          <input type="hidden" name="id" value={inv.id} />
                          <button
                            type="submit"
                            className={styles.ghostButton}
                            style={{ minHeight: 30, fontSize: 9.5, paddingInline: 12 }}
                          >
                            Mark Unpaid
                          </button>
                        </form>
                      )}
                      <form action={duplicateInvoiceAction} style={{ display: "contents" }}>
                        <input type="hidden" name="id" value={inv.id} />
                        <button
                          type="submit"
                          className={styles.ghostButton}
                          style={{ minHeight: 30, fontSize: 9.5, paddingInline: 12 }}
                        >
                          Duplicate
                        </button>
                      </form>
                      <form action={deleteInvoiceAction} style={{ display: "contents" }}>
                        <input type="hidden" name="id" value={inv.id} />
                        <button
                          type="submit"
                          className={styles.dangerButton}
                          style={{ minHeight: 30, fontSize: 9.5, paddingInline: 12 }}
                          onClick={(e) => {
                            if (!confirm(`Delete ${inv.invoiceNumber}?`)) e.preventDefault();
                          }}
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
