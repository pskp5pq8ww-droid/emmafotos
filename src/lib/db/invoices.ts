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
  type InvoiceDatabase,
  emptyInvoiceDatabase,
} from "./invoice-types";

function getInvoicePath() {
  return path.join(getDataDir(), "invoices.json");
}

function normalizeInvoiceDatabase(raw: Partial<InvoiceDatabase>): InvoiceDatabase {
  return {
    invoices: Array.isArray(raw.invoices) ? raw.invoices : [],
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
