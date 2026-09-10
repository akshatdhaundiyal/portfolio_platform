"use client";

import React from "react";
import { DollarSign, CheckCircle2, Clock } from "lucide-react";

interface InvoiceFinOpsCardsProps {
  totalInvoiced: number;
  totalCollected: number;
  outstandingBalance: number;
  invoiceCount: number;
}

export default function InvoiceFinOpsCards({
  totalInvoiced,
  totalCollected,
  outstandingBalance,
  invoiceCount,
}: InvoiceFinOpsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
      <div className="p-5 rounded-xl bg-white dark:bg-[#18191d] border border-[#22211f]/10 dark:border-white/10 shadow-xs">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-2">
          <span>Total Contracted</span>
          <DollarSign className="w-4 h-4 text-[#d94e34]" />
        </div>
        <div className="text-3xl font-serif font-bold text-[#22211f] dark:text-white">
          ${totalInvoiced.toLocaleString()}
        </div>
        <div className="text-xs text-[#22211f]/50 dark:text-white/50 mt-1 font-mono">
          Across {invoiceCount} enterprise billing milestones
        </div>
      </div>

      <div className="p-5 rounded-xl bg-white dark:bg-[#18191d] border border-[#22211f]/10 dark:border-white/10 shadow-xs">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-2">
          <span>Collected Revenue</span>
          <CheckCircle2 className="w-4 h-4 text-[#27ae60]" />
        </div>
        <div className="text-3xl font-serif font-bold text-[#27ae60]">
          ${totalCollected.toLocaleString()}
        </div>
        <div className="text-xs text-[#22211f]/50 dark:text-white/50 mt-1 font-mono">
          Settled via corporate wire & ACH transfers
        </div>
      </div>

      <div className="p-5 rounded-xl bg-white dark:bg-[#18191d] border border-[#22211f]/10 dark:border-white/10 shadow-xs">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-2">
          <span>Outstanding Balance</span>
          <Clock className="w-4 h-4 text-[#e67e22]" />
        </div>
        <div className="text-3xl font-serif font-bold text-[#e67e22]">
          ${outstandingBalance.toLocaleString()}
        </div>
        <div className="text-xs text-[#22211f]/50 dark:text-white/50 mt-1 font-mono">
          Pending client signature / milestone verification
        </div>
      </div>
    </div>
  );
}
