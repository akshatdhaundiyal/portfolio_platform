"use client";

import React, { useState, useEffect } from "react";
import StudioNavbar from "@/components/admin/StudioNavbar";
import InvoiceFinOpsCards from "@/components/admin/invoices/InvoiceFinOpsCards";
import InvoiceInspector from "@/components/admin/invoices/InvoiceInspector";
import InvoiceModal from "@/components/admin/invoices/InvoiceModal";
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ChevronRight,
  Trash2,
  Edit2,
  CreditCard,
} from "lucide-react";
import type { InvoiceItem } from "@/lib/data/invoices";
import type { AuthUser } from "@/lib/auth";

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending" | "overdue">("all");
  const [user, setUser] = useState<AuthUser | null>(null);

  // Selected invoice for detail view
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceItem | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchSession();
    fetchInvoices();
  }, []);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth");
      const data = await res.json();
      if (data.authenticated) setUser(data.user);
    } catch {}
  };

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      if (Array.isArray(data)) setInvoices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = user?.role === "guest" || user?.role === "user";

  // FinOps summary stats
  const totalInvoiced = invoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
  const totalCollected = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
  const outstandingBalance = invoices
    .filter((inv) => inv.status === "pending" || inv.status === "overdue")
    .reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.clientCompany.toLowerCase().includes(q) ||
      inv.projectTitle.toLowerCase().includes(q) ||
      inv.description.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleOpenCreateModal = () => {
    if (isReadOnly) {
      alert("Read-only access. Generating invoices is restricted to Admin or Super Admin.");
      return;
    }
    setEditingInvoice(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (inv: InvoiceItem) => {
    if (isReadOnly) {
      alert("Read-only access.");
      return;
    }
    setEditingInvoice(inv);
    setIsModalOpen(true);
  };

  const handleSaveInvoice = async (invoiceData: Partial<InvoiceItem>) => {
    if (editingInvoice) {
      const res = await fetch(`/api/invoices/${editingInvoice.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });
      if (!res.ok) throw new Error("Failed to update invoice");
      setFeedback("Invoice updated successfully.");
    } else {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });
      if (!res.ok) throw new Error("Failed to create invoice");
      setFeedback("Invoice created successfully.");
    }

    setTimeout(() => setFeedback(""), 3000);
    fetchInvoices();
  };

  const handleDeleteInvoice = async (id: string, number: string) => {
    if (isReadOnly) return;
    if (!confirm(`Are you sure you want to delete invoice ${number}?`)) return;

    try {
      const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setFeedback(`Invoice ${number} deleted.`);
      setTimeout(() => setFeedback(""), 3000);
      fetchInvoices();
      if (selectedInvoice?.id === id) setSelectedInvoice(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    }
  };

  const handleMarkPaid = async (inv: InvoiceItem) => {
    if (isReadOnly) return;
    try {
      const res = await fetch(`/api/invoices/${inv.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "paid",
          paidAt: new Date().toISOString().split("T")[0],
          paymentMethod: "ACH Corporate Wire",
        }),
      });
      if (res.ok) {
        fetchInvoices();
        setFeedback(`Invoice ${inv.invoiceNumber} marked as Paid.`);
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#f6f4ee] dark:bg-[#121316] text-[#22211f] dark:text-[#ece9e2] flex flex-col md:flex-row antialiased selection:bg-[#d94e34]/20">
      {/* Vertical Left Studio Navbar */}
      <StudioNavbar
        user={user}
        activeRoute="/admin/invoices"
        badgeCounts={{
          invoices: invoices.length,
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-[#22211f]/10 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono bg-[#27ae60]/10 text-[#27ae60] dark:bg-[#27ae60]/20 border border-[#27ae60]/20 mb-3">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Client Transparency Portal • Milestone Billing & FinOps</span>
            </div>
            <h1 className="text-3xl font-serif tracking-tight text-[#22211f] dark:text-white">
              Invoices & Financial Clearing
            </h1>
            <p className="text-sm text-[#22211f]/60 dark:text-white/60 mt-1">
              Enterprise contract milestones, line-item ledger, and institutional billing reconciliation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreateModal}
              disabled={isReadOnly}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold bg-[#d94e34] hover:bg-[#c23d24] text-white shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Invoice</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className="mt-4 p-3 rounded-lg bg-[#27ae60]/10 border border-[#27ae60]/20 text-[#27ae60] text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Modular FinOps Cards */}
        <InvoiceFinOpsCards
          totalInvoiced={totalInvoiced}
          totalCollected={totalCollected}
          outstandingBalance={outstandingBalance}
          invoiceCount={invoices.length}
        />

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-3 rounded-xl bg-white dark:bg-[#18191d] border border-[#22211f]/10 dark:border-white/10">
          <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
            {(["all", "paid", "pending", "overdue"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-all ${
                  statusFilter === tab
                    ? "bg-[#22211f] text-white dark:bg-white dark:text-[#121316]"
                    : "text-[#22211f]/60 dark:text-white/60 hover:bg-[#22211f]/5 dark:hover:bg-white/5"
                }`}
              >
                {tab}
                <span className="ml-1.5 opacity-60 text-[10px]">
                  ({tab === "all" ? invoices.length : invoices.filter((i) => i.status === tab).length})
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#22211f]/40 dark:text-white/40" />
            <input
              type="text"
              placeholder="Search invoice, client, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white placeholder-[#22211f]/40 dark:placeholder-white/40 focus:outline-hidden focus:border-[#d94e34]"
            />
          </div>
        </div>

        {/* Ledger Table & Breakdown Layout */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`${selectedInvoice ? "lg:col-span-2" : "lg:col-span-3"} transition-all`}>
            {loading ? (
              <div className="p-12 text-center text-xs font-mono text-[#22211f]/40 dark:text-white/40">
                Loading invoices ledger...
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="p-12 text-center rounded-xl bg-white dark:bg-[#18191d] border border-dashed border-[#22211f]/15 dark:border-white/15">
                <FileText className="w-8 h-8 mx-auto text-[#22211f]/30 dark:text-white/30 mb-2" />
                <p className="text-sm font-mono text-[#22211f]/60 dark:text-white/60">
                  No invoices match your current filter.
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#18191d] rounded-xl border border-[#22211f]/10 dark:border-white/10 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#22211f]/10 dark:border-white/10 bg-[#f6f4ee]/50 dark:bg-[#121316]/50 text-[#22211f]/60 dark:text-white/60 font-mono uppercase tracking-wider">
                        <th className="py-3 px-4">Invoice #</th>
                        <th className="py-3 px-4">Client & Project</th>
                        <th className="py-3 px-4">Issue / Due</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#22211f]/5 dark:divide-white/5 font-sans">
                      {filteredInvoices.map((inv) => {
                        const isSelected = selectedInvoice?.id === inv.id;
                        return (
                          <tr
                            key={inv.id}
                            onClick={() => setSelectedInvoice(inv)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-[#d94e34]/5 dark:bg-[#d94e34]/10"
                                : "hover:bg-[#22211f]/2 dark:hover:bg-white/2"
                            }`}
                          >
                            <td className="py-3.5 px-4 font-mono font-semibold text-[#22211f] dark:text-white">
                              {inv.invoiceNumber}
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-[#22211f] dark:text-white">
                                {inv.clientCompany}
                              </div>
                              <div className="text-[11px] text-[#22211f]/60 dark:text-white/60 line-clamp-1">
                                {inv.projectTitle}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 font-mono text-[11px] text-[#22211f]/60 dark:text-white/60 whitespace-nowrap">
                              <div>{inv.issueDate}</div>
                              <div className="text-[10px] text-[#22211f]/40 dark:text-white/40">
                                Due: {inv.dueDate}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-right font-mono font-bold text-[#22211f] dark:text-white">
                              ${inv.totalAmount?.toLocaleString()}
                            </td>

                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                                  inv.status === "paid"
                                    ? "bg-[#27ae60]/10 text-[#27ae60] border border-[#27ae60]/20"
                                    : inv.status === "pending"
                                    ? "bg-[#e67e22]/10 text-[#e67e22] border border-[#e67e22]/20"
                                    : "bg-[#d94e34]/10 text-[#d94e34] border border-[#d94e34]/20"
                                }`}
                              >
                                {inv.status === "paid" ? (
                                  <CheckCircle2 className="w-3 h-3" />
                                ) : (
                                  <Clock className="w-3 h-3" />
                                )}
                                {inv.status}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div
                                className="flex items-center justify-end gap-1.5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {inv.status !== "paid" && !isReadOnly && (
                                  <button
                                    onClick={() => handleMarkPaid(inv)}
                                    title="Mark as Paid"
                                    className="p-1 rounded text-[#27ae60] hover:bg-[#27ae60]/10 transition-colors"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {!isReadOnly && (
                                  <>
                                    <button
                                      onClick={() => handleOpenEditModal(inv)}
                                      title="Edit Invoice"
                                      className="p-1 rounded text-[#22211f]/60 dark:text-white/60 hover:text-[#d94e34] hover:bg-[#d94e34]/10 transition-colors"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteInvoice(inv.id, inv.invoiceNumber)}
                                      title="Delete Invoice"
                                      className="p-1 rounded text-[#22211f]/40 dark:text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                                <ChevronRight className="w-3.5 h-3.5 text-[#22211f]/30 dark:text-white/30" />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Modular Line Item Breakdown Inspector Panel */}
          {selectedInvoice && (
            <div className="lg:col-span-1">
              <InvoiceInspector
                invoice={selectedInvoice}
                onClose={() => setSelectedInvoice(null)}
                onEdit={handleOpenEditModal}
                onMarkPaid={handleMarkPaid}
                isReadOnly={isReadOnly}
              />
            </div>
          )}
        </div>
      </main>

      {/* Modular Generate / Edit Invoice Modal */}
      <InvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveInvoice}
        editingInvoice={editingInvoice}
        invoiceCount={invoices.length}
      />
    </div>
  );
}
