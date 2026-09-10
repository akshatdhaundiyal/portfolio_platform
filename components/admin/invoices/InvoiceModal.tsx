"use client";

import React, { useState, useEffect } from "react";
import { X, CreditCard, Plus } from "lucide-react";
import type { InvoiceItem, InvoiceLineItem } from "@/lib/data/invoices";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoiceData: Partial<InvoiceItem>) => Promise<void>;
  editingInvoice: InvoiceItem | null;
  invoiceCount: number;
}

export default function InvoiceModal({
  isOpen,
  onClose,
  onSave,
  editingInvoice,
  invoiceCount,
}: InvoiceModalProps) {
  const [form, setForm] = useState<Partial<InvoiceItem>>({
    invoiceNumber: "",
    clientCompany: "",
    clientEmail: "",
    projectTitle: "",
    projectSlug: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    status: "pending",
    description: "Milestone Deliverable",
    lineItems: [
      { id: "1", description: "Architecture Consulting & System Delivery", quantity: 40, rate: 650, amount: 26000 },
    ],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingInvoice) {
      setForm({
        ...editingInvoice,
        lineItems: editingInvoice.lineItems && editingInvoice.lineItems.length > 0 ? [...editingInvoice.lineItems] : [
          { id: "1", description: "Service Deliverable", quantity: 1, rate: editingInvoice.totalAmount, amount: editingInvoice.totalAmount },
        ],
      });
    } else {
      setForm({
        invoiceNumber: `INV-2024-00${invoiceCount + 1}`,
        clientCompany: "",
        clientEmail: "",
        projectTitle: "",
        projectSlug: "",
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
        status: "pending",
        description: "Milestone Deliverable",
        lineItems: [
          { id: `item-${Date.now()}`, description: "Architecture Consulting & System Delivery", quantity: 40, rate: 650, amount: 26000 },
        ],
      });
    }
  }, [editingInvoice, invoiceCount, isOpen]);

  if (!isOpen) return null;

  const handleAddLineItem = () => {
    const newItem: InvoiceLineItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      description: "Engineering Milestone Phase",
      quantity: 20,
      rate: 650,
      amount: 13000,
    };
    setForm((prev) => ({
      ...prev,
      lineItems: [...(prev.lineItems || []), newItem],
    }));
  };

  const handleRemoveLineItem = (id: string) => {
    setForm((prev) => ({
      ...prev,
      lineItems: (prev.lineItems || []).filter((item) => item.id !== id),
    }));
  };

  const handleLineItemChange = (id: string, field: keyof InvoiceLineItem, val: string | number) => {
    setForm((prev) => {
      const items = (prev.lineItems || []).map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: val };
        if (field === "quantity" || field === "rate") {
          const q = field === "quantity" ? Number(val) : item.quantity;
          const r = field === "rate" ? Number(val) : item.rate;
          updated.amount = Math.round(q * r * 100) / 100;
        }
        return updated;
      });
      return { ...prev, lineItems: items };
    });
  };

  const computedTotal = (form.lineItems || []).reduce((acc, it) => acc + (it.amount || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientCompany || !form.invoiceNumber) {
      alert("Please fill in Client Company and Invoice Number.");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...form,
        totalAmount: computedTotal,
      });
      onClose();
    } catch (err: any) {
      alert(err.message || "Failed to save invoice.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#18191d] rounded-2xl border border-[#22211f]/10 dark:border-white/10 shadow-2xl p-6 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#22211f]/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#d94e34]" />
            <h2 className="text-lg font-serif font-bold text-[#22211f] dark:text-white">
              {editingInvoice ? "Edit Invoice" : "Generate Enterprise Invoice"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#22211f]/40 dark:text-white/40 hover:bg-[#22211f]/5 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1">
                Invoice Number *
              </label>
              <input
                type="text"
                required
                value={form.invoiceNumber || ""}
                onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1">
                Status
              </label>
              <select
                value={form.status || "pending"}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-mono"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1">
                Client Company *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. EXL Service"
                value={form.clientCompany || ""}
                onChange={(e) => setForm({ ...form, clientCompany: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white"
              />
            </div>

            <div>
              <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1">
                Client Billing Email
              </label>
              <input
                type="email"
                placeholder="billing@company.com"
                value={form.clientEmail || ""}
                onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1">
                Project Deliverable Title
              </label>
              <input
                type="text"
                placeholder="Actuarial Pricing & GLM Triage"
                value={form.projectTitle || ""}
                onChange={(e) => setForm({ ...form, projectTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white"
              />
            </div>

            <div>
              <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1">
                Project Slug / Identifier
              </label>
              <input
                type="text"
                placeholder="actuarial-pricing-glm-triage"
                value={form.projectSlug || ""}
                onChange={(e) => setForm({ ...form, projectSlug: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                value={form.issueDate || ""}
                onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={form.dueDate || ""}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Dynamic Line Items Section */}
          <div className="pt-2 border-t border-[#22211f]/10 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <label className="font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60">
                Milestone Line Items
              </label>
              <button
                type="button"
                onClick={handleAddLineItem}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-[#d94e34] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-[#f6f4ee] dark:bg-[#121316] rounded-lg border border-[#22211f]/5 dark:border-white/5">
              {(form.lineItems || []).map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-2 items-center bg-white dark:bg-[#18191d] p-2 rounded-md border border-[#22211f]/10 dark:border-white/10"
                >
                  <div className="col-span-6">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleLineItemChange(item.id, "description", e.target.value)}
                      className="w-full px-2 py-1 rounded bg-[#f6f4ee] dark:bg-[#121316] text-xs text-[#22211f] dark:text-white border-0"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Hours/Qty"
                      value={item.quantity}
                      onChange={(e) => handleLineItemChange(item.id, "quantity", Number(e.target.value))}
                      className="w-full px-2 py-1 rounded bg-[#f6f4ee] dark:bg-[#121316] text-xs text-[#22211f] dark:text-white font-mono border-0"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) => handleLineItemChange(item.id, "rate", Number(e.target.value))}
                      className="w-full px-2 py-1 rounded bg-[#f6f4ee] dark:bg-[#121316] text-xs text-[#22211f] dark:text-white font-mono border-0"
                    />
                  </div>
                  <div className="col-span-1 font-mono font-bold text-[11px] text-right text-[#22211f] dark:text-white">
                    ${item.amount?.toLocaleString()}
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveLineItem(item.id)}
                      className="text-[#22211f]/40 dark:text-white/40 hover:text-red-500 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end items-center gap-2 mt-3 text-xs font-mono">
              <span className="text-[#22211f]/60 dark:text-white/60 uppercase">Calculated Total:</span>
              <span className="text-base font-bold text-[#d94e34]">
                ${computedTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#22211f]/10 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-mono text-[#22211f]/60 dark:text-white/60 hover:bg-[#22211f]/5 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold bg-[#d94e34] hover:bg-[#c23d24] text-white shadow-xs disabled:opacity-50"
            >
              {editingInvoice ? "Save Changes" : "Create Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
