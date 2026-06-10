/**
 * Separate persistence layer for invoices.
 * Stored in {DATA_DIR}/invoices.json — completely independent of db.json.
 * Uses the same atomic write-queue pattern as the main db layer.
 */
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { getDataDir, ensureStorage } from "./index";
import {
  type Invoice,
  type InvoiceLineItem,
  type InvoiceDatabase,
  emptyInvoiceDatabase,
} from "./invoice-types";

function getInvoicePath() {
  return path.join(getDataDir(), "invoices.json");
}

/** Coerce any value to a finite number (defaults to 0). */
function num(value: unknown): number {
  const n = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(n) ? n : 0;
}

/** Coerce any value to a string (defaults to ""). */
function str(value: unknown): string {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

/**
 * Defensive coercion of a single line item. A legacy or hand-edited record
 * could be missing numeric fields, which would later crash `.toFixed()`.
 */
function normalizeLineItem(raw: Partial<InvoiceLineItem> | undefined): InvoiceLineItem {
  const item = raw ?? {};
  return {
    id: str(item.id) || `li-${Math.random().toString(36).slice(2)}`,
    description: str(item.description),
    note: typeof item.note === "string" ? item.note : undefined,
    quantity: num(item.quantity),
    unitPrice: num(item.unitPrice),
    discountPercent: num(item.discountPercent),
    amount: num(item.amount),
  };
}

/**
 * Defensive coercion of a stored invoice so the admin UI / PDF generator
 * never crash on a malformed record (missing numeric fields, absent
 * lineItems array, etc.). Valid invoices pass through unchanged.
 */
function normalizeInvoice(raw: Partial<Invoice>): Invoice {
  const lineItems = Array.isArray(raw.lineItems) ? raw.lineItems : [];
  return {
    id: str(raw.id),
    invoiceNumber: str(raw.invoiceNumber),
    status: (raw.status as Invoice["status"]) || "draft",
    issueDate: str(raw.issueDate),
    dueDate: str(raw.dueDate),
    paymentMethod: str(raw.paymentMethod),
    clientName: str(raw.clientName),
    clientEmail: typeof raw.clientEmail === "string" ? raw.clientEmail : undefined,
    clientAddress: typeof raw.clientAddress === "string" ? raw.clientAddress : undefined,
    clientPhone: typeof raw.clientPhone === "string" ? raw.clientPhone : undefined,
    lineItems: lineItems.map(normalizeLineItem),
    subtotal: num(raw.subtotal),
    gstEnabled: Boolean(raw.gstEnabled),
    gstRate: num(raw.gstRate),
    gstAmount: num(raw.gstAmount),
    total: num(raw.total),
    totalDue: num(raw.totalDue),
    paymentNotes: typeof raw.paymentNotes === "string" ? raw.paymentNotes : undefined,
    internalNote: typeof raw.internalNote === "string" ? raw.internalNote : undefined,
    createdAt: str(raw.createdAt),
    updatedAt: str(raw.updatedAt),
  };
}

function normalizeInvoiceDatabase(raw: Partial<InvoiceDatabase>): InvoiceDatabase {
  return {
    invoices: Array.isArray(raw.invoices)
      ? raw.invoices.map((inv) => normalizeInvoice(inv as Partial<Invoice>))
      : [],
    nextNumber: typeof raw.nextNumber === "number" ? raw.nextNumber : 1,
  };
}

let invoiceWriteQueue = Promise.resolve();

export async function readInvoices(): Promise<InvoiceDatabase> {
  await ensureStorage();
  const filePath = getInvoicePath();

  if (!existsSync(filePath)) {
    await writeInvoices(emptyInvoiceDatabase);
    return emptyInvoiceDatabase;
  }

  const raw = await readFile(filePath, "utf8");
  return normalizeInvoiceDatabase(JSON.parse(raw) as Partial<InvoiceDatabase>);
}

export async function writeInvoices(db: InvoiceDatabase): Promise<void> {
  await ensureStorage();
  const filePath = getInvoicePath();

  const write = async () => {
    const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    const payload = `${JSON.stringify(normalizeInvoiceDatabase(db), null, 2)}\n`;
    await writeFile(tmpPath, payload, "utf8");
    await rename(tmpPath, filePath);
  };

  invoiceWriteQueue = invoiceWriteQueue.then(write, write);
  return invoiceWriteQueue;
}

let invoiceUpdateQueue: Promise<unknown> = Promise.resolve();

export async function updateInvoices(
  updater: (db: InvoiceDatabase) => InvoiceDatabase | Promise<InvoiceDatabase>,
): Promise<InvoiceDatabase> {
  const run = async (): Promise<InvoiceDatabase> => {
    const current = await readInvoices();
    const next = normalizeInvoiceDatabase(await updater(current));
    await writeInvoices(next);
    return next;
  };

  const result = invoiceUpdateQueue.then(run, run) as Promise<InvoiceDatabase>;
  invoiceUpdateQueue = result.catch(() => undefined);
  return result;
}

/** Returns a zero-padded invoice number string, e.g. 3 → "INV-003" */
export function formatInvoiceNumber(n: number): string {
  return `INV-${String(n).padStart(3, "0")}`;
}

export type { Invoice, InvoiceDatabase };
