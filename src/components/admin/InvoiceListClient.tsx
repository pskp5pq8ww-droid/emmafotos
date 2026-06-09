"use client";

import { useState } from "react";
import Link from "next/link";
import type { Invoice } from "@/lib/db/invoice-types";
import {
  deleteInvoiceAction,
  duplicateInvoiceAction,
  markPaidAction,
  markUnpaidAction,
} from "@app/admin/invoices/actions";
import styles from "./Admin.module.css";

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtCurrency(n: number) { return `$${n.toFixed(2)}`; }
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

// ── Component ─────────────────────────────────────────────────────────────────

export function InvoiceListClient({ invoices }: { invoices: Invoice[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Invoice["status"]>("all");

  const filtered = invoices.filter((inv) => {
    const matchSearch =
      !search ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
      (inv.clientEmail ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <>
      {/* Search + filter bar */}
      <div className={styles.searchBar}>
        <input
          type="search"
          placeholder="Search by invoice # or client…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search invoices"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          aria-label="Filter by status"
        >
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="sent">Sent</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className={styles.panel}>
        {filtered.length === 0 ? (
          <div className={styles.panelPad} style={{ color: "#A1A1AA", fontSize: 14 }}>
            {invoices.length === 0 ? (
              <>No invoices yet.{" "}<Link href="/admin/invoices/new" style={{ color: "#E8C878" }}>Create your first invoice →</Link></>
            ) : (
              "No invoices match your search."
            )}
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
              {filtered.map((inv) => (
                <tr key={inv.id}>
                  <td>
                    <Link href={`/admin/invoices/${inv.id}`} style={{ color: "#E8C878", fontWeight: 500 }}>
                      {inv.invoiceNumber}
                    </Link>
                  </td>
                  <td>
                    {inv.clientName}
                    {inv.clientEmail && (
                      <><br /><span className={styles.muted}>{inv.clientEmail}</span></>
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
                      <Link href={`/admin/invoices/${inv.id}`}
                        className={styles.ghostButton}
                        style={{ minHeight: 30, fontSize: 9.5, paddingInline: 12 }}>
                        Edit
                      </Link>

                      {inv.status !== "paid" ? (
                        <form action={markPaidAction} style={{ display: "contents" }}>
                          <input type="hidden" name="id" value={inv.id} />
                          <button type="submit" className={styles.successButton}
                            style={{ minHeight: 30, fontSize: 9.5, paddingInline: 12 }}>
                            Mark Paid
                          </button>
                        </form>
                      ) : (
                        <form action={markUnpaidAction} style={{ display: "contents" }}>
                          <input type="hidden" name="id" value={inv.id} />
                          <button type="submit" className={styles.ghostButton}
                            style={{ minHeight: 30, fontSize: 9.5, paddingInline: 12 }}>
                            Mark Unpaid
                          </button>
                        </form>
                      )}

                      <form action={duplicateInvoiceAction} style={{ display: "contents" }}>
                        <input type="hidden" name="id" value={inv.id} />
                        <button type="submit" className={styles.ghostButton}
                          style={{ minHeight: 30, fontSize: 9.5, paddingInline: 12 }}>
                          Duplicate
                        </button>
                      </form>

                      <form action={deleteInvoiceAction} style={{ display: "contents" }}>
                        <input type="hidden" name="id" value={inv.id} />
                        <button type="submit" className={styles.dangerButton}
                          style={{ minHeight: 30, fontSize: 9.5, paddingInline: 12 }}
                          onClick={(e) => {
                            if (!confirm(`Delete ${inv.invoiceNumber}? This cannot be undone.`))
                              e.preventDefault();
                          }}>
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
    </>
  );
}
