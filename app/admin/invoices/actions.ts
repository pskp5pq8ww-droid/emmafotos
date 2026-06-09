"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-auth/session";
import {
  readInvoices,
  updateInvoices,
  formatInvoiceNumber,
} from "@/lib/db/invoices";
import { upsertInvoiceClient } from "@/lib/db/invoice-clients";
import type { Invoice, InvoiceLineItem } from "@/lib/db/invoice-types";

async function requireAdmin() {
  if (!(await hasAdminSession())) {
    redirect("/admin-login");
  }
}

function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function num(formData: FormData, key: string): number {
  const v = str(formData, key);
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

function calcLineItem(item: InvoiceLineItem): InvoiceLineItem {
  const gross = item.quantity * item.unitPrice;
  const discount = gross * (item.discountPercent / 100);
  return { ...item, amount: Math.round((gross - discount) * 100) / 100 };
}

function calcTotals(
  lineItems: InvoiceLineItem[],
  gstEnabled: boolean,
  gstRate: number,
) {
  const subtotal = lineItems.reduce((s, li) => s + li.amount, 0);
  const gstAmount = gstEnabled
    ? Math.round(subtotal * (gstRate / 100) * 100) / 100
    : 0;
  const total = Math.round((subtotal + gstAmount) * 100) / 100;
  return { subtotal: Math.round(subtotal * 100) / 100, gstAmount, total };
}

/** Parse line items from FormData (array fields: description[], qty[], etc.) */
function parseLineItems(formData: FormData): InvoiceLineItem[] {
  const descriptions = formData.getAll("li_description");
  const items: InvoiceLineItem[] = [];

  for (let i = 0; i < descriptions.length; i++) {
    const description = typeof descriptions[i] === "string"
      ? (descriptions[i] as string).trim()
      : "";
    if (!description) continue;

    const qty = parseFloat(
      (formData.getAll("li_quantity")[i] as string) || "1",
    );
    const unitPrice = parseFloat(
      (formData.getAll("li_unitPrice")[i] as string) || "0",
    );
    const discountPercent = parseFloat(
      (formData.getAll("li_discount")[i] as string) || "0",
    );
    const note = (formData.getAll("li_note")[i] as string)?.trim() || undefined;
    const existingId = (formData.getAll("li_id")[i] as string)?.trim();

    const partial: InvoiceLineItem = {
      id: existingId || randomUUID(),
      description,
      note,
      quantity: isNaN(qty) ? 1 : qty,
      unitPrice: isNaN(unitPrice) ? 0 : unitPrice,
      discountPercent: isNaN(discountPercent) ? 0 : discountPercent,
      amount: 0,
    };
    items.push(calcLineItem(partial));
  }
  return items;
}

export async function getNextInvoiceNumberAction(): Promise<string> {
  await requireAdmin();
  const db = await readInvoices();
  return formatInvoiceNumber(db.nextNumber);
}

export async function createInvoiceAction(formData: FormData) {
  await requireAdmin();

  const lineItems = parseLineItems(formData);
  const gstEnabled = formData.get("gstEnabled") === "on";
  const gstRate = num(formData, "gstRate") || 10;
  const { subtotal, gstAmount, total } = calcTotals(lineItems, gstEnabled, gstRate);

  const now = new Date().toISOString();
  let newInvoice: Invoice | null = null;

  await updateInvoices((db) => {
    const invoiceNumber = str(formData, "invoiceNumber") || formatInvoiceNumber(db.nextNumber);
    newInvoice = {
      id: randomUUID(),
      invoiceNumber,
      status: (str(formData, "status") as Invoice["status"]) || "draft",
      issueDate: str(formData, "issueDate") || now.slice(0, 10),
      dueDate: str(formData, "dueDate") || now.slice(0, 10),
      paymentMethod: str(formData, "paymentMethod"),
      clientName: str(formData, "clientName"),
      clientEmail: str(formData, "clientEmail") || undefined,
      clientAddress: str(formData, "clientAddress") || undefined,
      clientPhone: str(formData, "clientPhone") || undefined,
      lineItems,
      subtotal,
      gstEnabled,
      gstRate,
      gstAmount,
      total,
      totalDue: total,
      paymentNotes: str(formData, "paymentNotes") || undefined,
      internalNote: str(formData, "internalNote") || undefined,
      createdAt: now,
      updatedAt: now,
    };

    // Only bump the counter if we auto-used it
    const usedAutoNumber = !str(formData, "invoiceNumber");
    return {
      invoices: [...db.invoices, newInvoice!],
      nextNumber: usedAutoNumber ? db.nextNumber + 1 : db.nextNumber,
    };
  });

  // Persist client for future autocomplete
  const clientName = str(formData, "clientName");
  if (clientName) {
    await upsertInvoiceClient({
      name: clientName,
      email: str(formData, "clientEmail") || undefined,
      phone: str(formData, "clientPhone") || undefined,
      address: str(formData, "clientAddress") || undefined,
    });
  }

  revalidatePath("/admin/invoices");
  redirect(`/admin/invoices/${newInvoice!.id}`);
}

export async function updateInvoiceAction(formData: FormData) {
  await requireAdmin();

  const id = str(formData, "id");
  if (!id) return;

  const lineItems = parseLineItems(formData);
  const gstEnabled = formData.get("gstEnabled") === "on";
  const gstRate = num(formData, "gstRate") || 10;
  const { subtotal, gstAmount, total } = calcTotals(lineItems, gstEnabled, gstRate);

  await updateInvoices((db) => {
    const idx = db.invoices.findIndex((inv) => inv.id === id);
    if (idx === -1) return db;

    const updated: Invoice = {
      ...db.invoices[idx],
      invoiceNumber: str(formData, "invoiceNumber") || db.invoices[idx].invoiceNumber,
      status: (str(formData, "status") as Invoice["status"]) || db.invoices[idx].status,
      issueDate: str(formData, "issueDate") || db.invoices[idx].issueDate,
      dueDate: str(formData, "dueDate") || db.invoices[idx].dueDate,
      paymentMethod: str(formData, "paymentMethod"),
      clientName: str(formData, "clientName"),
      clientEmail: str(formData, "clientEmail") || undefined,
      clientAddress: str(formData, "clientAddress") || undefined,
      clientPhone: str(formData, "clientPhone") || undefined,
      lineItems,
      subtotal,
      gstEnabled,
      gstRate,
      gstAmount,
      total,
      totalDue: total,
      paymentNotes: str(formData, "paymentNotes") || undefined,
      internalNote: str(formData, "internalNote") || undefined,
      updatedAt: new Date().toISOString(),
    };

    const invoices = [...db.invoices];
    invoices[idx] = updated;
    return { ...db, invoices };
  });

  // Keep client record up to date
  const clientName = str(formData, "clientName");
  if (clientName) {
    await upsertInvoiceClient({
      name: clientName,
      email: str(formData, "clientEmail") || undefined,
      phone: str(formData, "clientPhone") || undefined,
      address: str(formData, "clientAddress") || undefined,
    });
  }

  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${id}`);
  redirect(`/admin/invoices/${id}`);
}

export async function deleteInvoiceAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  if (!id) return;

  await updateInvoices((db) => ({
    ...db,
    invoices: db.invoices.filter((inv) => inv.id !== id),
  }));

  revalidatePath("/admin/invoices");
  redirect("/admin/invoices");
}

export async function markPaidAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  if (!id) return;

  await updateInvoices((db) => ({
    ...db,
    invoices: db.invoices.map((inv) =>
      inv.id === id ? { ...inv, status: "paid" as const, updatedAt: new Date().toISOString() } : inv,
    ),
  }));

  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${id}`);
}

export async function markUnpaidAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  if (!id) return;

  await updateInvoices((db) => ({
    ...db,
    invoices: db.invoices.map((inv) =>
      inv.id === id ? { ...inv, status: "unpaid" as const, updatedAt: new Date().toISOString() } : inv,
    ),
  }));

  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${id}`);
}

export async function duplicateInvoiceAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  if (!id) return;

  let newId: string | null = null;

  await updateInvoices((db) => {
    const original = db.invoices.find((inv) => inv.id === id);
    if (!original) return db;

    const now = new Date().toISOString();
    newId = randomUUID();
    const copy: Invoice = {
      ...original,
      id: newId,
      invoiceNumber: formatInvoiceNumber(db.nextNumber),
      status: "draft",
      createdAt: now,
      updatedAt: now,
      lineItems: original.lineItems.map((li) => ({ ...li, id: randomUUID() })),
    };

    return {
      invoices: [...db.invoices, copy],
      nextNumber: db.nextNumber + 1,
    };
  });

  revalidatePath("/admin/invoices");
  if (newId) redirect(`/admin/invoices/${newId}`);
}
