/**
 * Persistence layer for invoice clients.
 * Stored in {DATA_DIR}/invoice-clients.json — independent of db.json and invoices.json.
 * Follows the same atomic write-queue pattern as the rest of the DB layer.
 */
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { getDataDir, ensureStorage } from "./index";
import {
  type InvoiceClient,
  type InvoiceClientsDatabase,
  emptyInvoiceClientsDatabase,
} from "./invoice-types";

function getClientsPath() {
  return path.join(getDataDir(), "invoice-clients.json");
}

function normalizeClientsDatabase(
  raw: Partial<InvoiceClientsDatabase>,
): InvoiceClientsDatabase {
  return {
    clients: Array.isArray(raw.clients) ? raw.clients : [],
  };
}

let clientWriteQueue = Promise.resolve();

export async function readInvoiceClients(): Promise<InvoiceClientsDatabase> {
  await ensureStorage();
  const filePath = getClientsPath();

  if (!existsSync(filePath)) {
    await writeInvoiceClients(emptyInvoiceClientsDatabase);
    return emptyInvoiceClientsDatabase;
  }

  const raw = await readFile(filePath, "utf8");
  return normalizeClientsDatabase(
    JSON.parse(raw) as Partial<InvoiceClientsDatabase>,
  );
}

export async function writeInvoiceClients(
  db: InvoiceClientsDatabase,
): Promise<void> {
  await ensureStorage();
  const filePath = getClientsPath();

  const write = async () => {
    const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    const payload = `${JSON.stringify(normalizeClientsDatabase(db), null, 2)}\n`;
    await writeFile(tmpPath, payload, "utf8");
    await rename(tmpPath, filePath);
  };

  clientWriteQueue = clientWriteQueue.then(write, write);
  return clientWriteQueue;
}

let clientUpdateQueue: Promise<unknown> = Promise.resolve();

export async function updateInvoiceClients(
  updater: (
    db: InvoiceClientsDatabase,
  ) => InvoiceClientsDatabase | Promise<InvoiceClientsDatabase>,
): Promise<InvoiceClientsDatabase> {
  const run = async (): Promise<InvoiceClientsDatabase> => {
    const current = await readInvoiceClients();
    const next = normalizeClientsDatabase(await updater(current));
    await writeInvoiceClients(next);
    return next;
  };

  const result = clientUpdateQueue.then(run, run) as Promise<InvoiceClientsDatabase>;
  clientUpdateQueue = result.catch(() => undefined);
  return result;
}

/**
 * Upsert a client from invoice data.
 * Matches by name (case-insensitive) or email if provided.
 * If found: updates email/phone/address if supplied, bumps lastUsedAt + invoiceCount.
 * If not found: creates a new record.
 */
export async function upsertInvoiceClient(data: {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}): Promise<InvoiceClient> {
  let upserted: InvoiceClient | null = null;

  await updateInvoiceClients((db) => {
    const now = new Date().toISOString();
    const nameLower = data.name.trim().toLowerCase();
    const emailLower = data.email?.trim().toLowerCase();

    const existingIdx = db.clients.findIndex((c) => {
      const nameMatch = c.name.toLowerCase() === nameLower;
      const emailMatch =
        emailLower && c.email?.toLowerCase() === emailLower;
      return nameMatch || emailMatch;
    });

    if (existingIdx !== -1) {
      const existing = db.clients[existingIdx];
      upserted = {
        ...existing,
        // Update fields only if new values are provided
        email: data.email?.trim() || existing.email,
        phone: data.phone?.trim() || existing.phone,
        address: data.address?.trim() || existing.address,
        invoiceCount: existing.invoiceCount + 1,
        lastUsedAt: now,
        updatedAt: now,
      };
      const clients = [...db.clients];
      clients[existingIdx] = upserted;
      return { ...db, clients };
    }

    upserted = {
      id: randomUUID(),
      name: data.name.trim(),
      email: data.email?.trim() || undefined,
      phone: data.phone?.trim() || undefined,
      address: data.address?.trim() || undefined,
      invoiceCount: 1,
      lastUsedAt: now,
      createdAt: now,
      updatedAt: now,
    };
    return { ...db, clients: [...db.clients, upserted] };
  });

  return upserted!;
}

export type { InvoiceClient, InvoiceClientsDatabase };
