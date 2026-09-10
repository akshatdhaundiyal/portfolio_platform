import { initialInvoices, type InvoiceItem } from "./data/invoices";

// Runtime memory store
let memoryInvoices: InvoiceItem[] = [...initialInvoices];

export async function getAllInvoices(statusFilter?: string): Promise<InvoiceItem[]> {
  if (statusFilter && statusFilter !== "all") {
    return memoryInvoices.filter((inv) => inv.status === statusFilter);
  }
  return memoryInvoices;
}

export async function getInvoiceById(id: string): Promise<InvoiceItem | null> {
  return memoryInvoices.find((inv) => inv.id === id) || null;
}

export async function createInvoice(data: Partial<InvoiceItem>): Promise<InvoiceItem> {
  const nextNum = memoryInvoices.length + 1;
  const invNumber = data.invoiceNumber || `INV-2024-00${nextNum}`;
  
  // Calculate total amount from line items if provided
  let total = data.totalAmount || 0;
  if (data.lineItems && data.lineItems.length > 0) {
    total = data.lineItems.reduce((acc, item) => acc + (item.amount || item.quantity * item.rate), 0);
  }

  const newInvoice: InvoiceItem = {
    id: data.id || `inv-${Date.now()}`,
    invoiceNumber: invNumber,
    clientCompany: data.clientCompany || "Enterprise Client",
    clientEmail: data.clientEmail || "billing@client.com",
    projectSlug: data.projectSlug || "general-architecture",
    projectTitle: data.projectTitle || "Architecture & System Consulting",
    issueDate: data.issueDate || new Date().toISOString().split("T")[0],
    dueDate: data.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    totalAmount: total,
    status: data.status || "pending",
    description: data.description || "Production Milestone Deliverable",
    lineItems: data.lineItems || [],
  };

  memoryInvoices.unshift(newInvoice);
  return newInvoice;
}

export async function updateInvoice(id: string, updates: Partial<InvoiceItem>): Promise<InvoiceItem | null> {
  const idx = memoryInvoices.findIndex((inv) => inv.id === id);
  if (idx === -1) return null;

  memoryInvoices[idx] = {
    ...memoryInvoices[idx],
    ...updates,
  };
  return memoryInvoices[idx];
}

export async function deleteInvoice(id: string): Promise<boolean> {
  const initialLen = memoryInvoices.length;
  memoryInvoices = memoryInvoices.filter((inv) => inv.id !== id);
  return memoryInvoices.length < initialLen;
}
