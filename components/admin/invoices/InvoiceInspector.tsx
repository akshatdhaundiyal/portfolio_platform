"use client";

import React from "react";
import { X, CheckCircle2 } from "lucide-react";
import type { InvoiceItem } from "@/lib/data/invoices";

interface InvoiceInspectorProps {
  invoice: InvoiceItem | null;
  onClose: () => void;
  onEdit: (invoice: InvoiceItem) => void;
  onMarkPaid: (invoice: InvoiceItem) => void;
  isReadOnly: boolean;
}

export default function InvoiceInspector({
  invoice,
  onClose,
  onEdit,
  onMarkPaid,
  isReadOnly,
}: InvoiceInspectorProps) {
  if (!invoice) return null;

  return (
    <div className="bg-white dark:bg-[#18191d] rounded-xl border border-[#22211f]/10 dark:border-white/10 p-5 shadow-xs sticky top-8">
      <div className="flex items-center justify-between pb-4 border-b border-[#22211f]/10 dark:border-white/10">
        <div>
          <span className="font-mono text-xs text-[#d94e34] font-semibold">
            {invoice.invoiceNumber}
          </span>
          <h3 className="font-serif text-lg font-bold text-[#22211f] dark:text-white mt-0.5">
            {invoice.clientCompany}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-[#22211f]/40 dark:text-white/40 hover:bg-[#22211f]/5 dark:hover:bg-white/5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Meta details */}
      <div className="py-4 space-y-2 border-b border-[#22211f]/10 dark:border-white/10 text-xs">
        <div className="flex justify-between">
          <span className="text-[#22211f]/50 dark:text-white/50">Billing Contact:</span>
          <span className="font-mono text-[#22211f] dark:text-white">
            {invoice.clientEmail}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#22211f]/50 dark:text-white/50">Contract Deliverable:</span>
          <span className="font-medium text-[#22211f] dark:text-white line-clamp-1">
            {invoice.projectTitle}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#22211f]/50 dark:text-white/50">Issue Date:</span>
          <span className="font-mono">{invoice.issueDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#22211f]/50 dark:text-white/50">Due Date:</span>
          <span className="font-mono text-[#e67e22] font-semibold">
            {invoice.dueDate}
          </span>
        </div>
        {invoice.paidAt && (
          <div className="flex justify-between">
            <span className="text-[#22211f]/50 dark:text-white/50">Settled Date:</span>
            <span className="font-mono text-[#27ae60]">{invoice.paidAt}</span>
          </div>
        )}
        {invoice.paymentMethod && (
          <div className="flex justify-between">
            <span className="text-[#22211f]/50 dark:text-white/50">Method:</span>
            <span className="font-mono">{invoice.paymentMethod}</span>
          </div>
        )}
      </div>

      {/* Line Items Table */}
      <div className="py-4 border-b border-[#22211f]/10 dark:border-white/10">
        <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-3">
          Line Item Breakdown
        </h4>
        <div className="space-y-3">
          {invoice.lineItems && invoice.lineItems.length > 0 ? (
            invoice.lineItems.map((item) => (
              <div key={item.id} className="text-xs">
                <div className="font-medium text-[#22211f] dark:text-white">
                  {item.description}
                </div>
                <div className="flex justify-between text-[11px] text-[#22211f]/50 dark:text-white/50 font-mono mt-0.5">
                  <span>
                    {item.quantity} hrs @ ${item.rate}/hr
                  </span>
                  <span className="font-bold text-[#22211f] dark:text-white">
                    ${item.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-[#22211f]/50 dark:text-white/50">
              {invoice.description}
            </div>
          )}
        </div>
      </div>

      {/* Total */}
      <div className="pt-4 flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#22211f]/70 dark:text-white/70">
          Total Amount Due
        </span>
        <span className="font-serif text-2xl font-bold text-[#d94e34]">
          ${invoice.totalAmount?.toLocaleString()}
        </span>
      </div>

      {/* Action buttons */}
      {!isReadOnly && (
        <div className="mt-5 flex items-center gap-2">
          <button
            onClick={() => onEdit(invoice)}
            className="flex-1 py-2 rounded-lg text-xs font-mono text-center border border-[#22211f]/20 dark:border-white/20 hover:bg-[#22211f]/5 dark:hover:bg-white/5 transition-colors"
          >
            Edit Invoice
          </button>
          {invoice.status !== "paid" && (
            <button
              onClick={() => onMarkPaid(invoice)}
              className="flex-1 py-2 rounded-lg text-xs font-mono font-semibold text-center bg-[#27ae60] hover:bg-[#219150] text-white transition-colors"
            >
              Mark Paid
            </button>
          )}
        </div>
      )}
    </div>
  );
}
