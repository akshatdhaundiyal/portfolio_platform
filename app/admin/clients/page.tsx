"use client";

import React, { useState, useEffect } from "react";
import StudioNavbar from "@/components/admin/StudioNavbar";
import ClientModal from "@/components/admin/clients/ClientModal";
import {
  Users,
  Plus,
  Search,
  Mail,
  Building,
  Briefcase,
  DollarSign,
  Edit2,
  Trash2,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import type { ClientItem } from "@/lib/data/clients";
import type { AuthUser } from "@/lib/auth";

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Archived">("All");
  const [user, setUser] = useState<AuthUser | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchSession();
    fetchClients();
  }, []);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth");
      const data = await res.json();
      if (data.authenticated) setUser(data.user);
    } catch {}
  };

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      if (Array.isArray(data)) setClients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = user?.role === "guest" || user?.role === "user";

  const handleOpenNew = () => {
    if (isReadOnly) {
      alert("Read-only preview. Editing client records is restricted to Admin or Super Admin.");
      return;
    }
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client: ClientItem) => {
    if (isReadOnly) {
      alert("Read-only preview.");
      return;
    }
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleSaveClient = async (payload: Partial<ClientItem>) => {
    if (editingClient) {
      const res = await fetch(`/api/clients/${editingClient.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update client.");
      setFeedback("Client profile updated.");
    } else {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create client.");
      setFeedback("New client added successfully.");
    }

    setTimeout(() => setFeedback(""), 3000);
    fetchClients();
  };

  const handleDelete = async (id: string, company: string) => {
    if (isReadOnly) return;
    if (!confirm(`Are you sure you want to delete ${company}?`)) return;

    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setFeedback(`Client ${company} deleted.`);
      setTimeout(() => setFeedback(""), 3000);
      fetchClients();
    } catch (err: any) {
      alert(err.message || "Failed to delete client.");
    }
  };

  const filteredClients = clients.filter((c) => {
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      c.company.toLowerCase().includes(q) ||
      c.contactName?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.role?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f6f4ee] dark:bg-[#121316] text-[#22211f] dark:text-[#ece9e2] flex flex-col md:flex-row antialiased selection:bg-[#d94e34]/20">
      {/* Vertical Left Studio Navbar */}
      <StudioNavbar
        user={user}
        activeRoute="/admin/clients"
        badgeCounts={{
          clients: clients.length,
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-[#22211f]/10 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono bg-[#27ae60]/10 text-[#27ae60] dark:bg-[#27ae60]/20 border border-[#27ae60]/20 mb-3">
              <Users className="w-3.5 h-3.5" />
              <span>Client Transparency Portal • Enterprise Engagements</span>
            </div>
            <h1 className="text-3xl font-serif tracking-tight text-[#22211f] dark:text-white">
              Client Directory & Scopes
            </h1>
            <p className="text-sm text-[#22211f]/60 dark:text-white/60 mt-1">
              Active enterprise client accounts, contractual roles, statements of work, and billing reconciliations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenNew}
              disabled={isReadOnly}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold bg-[#d94e34] hover:bg-[#c23d24] text-white shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Add Client</span>
            </button>
          </div>
        </div>

        {/* Read-Only Notice */}
        {isReadOnly && (
          <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-mono flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>
              Preview Mode Active ({user?.badge}). Client records and financial totals are masked. Edits are restricted to Admin or Super Admin roles.
            </span>
          </div>
        )}

        {/* Feedback Alert */}
        {feedback && (
          <div className="mt-6 p-4 rounded-xl bg-[#27ae60]/10 border border-[#27ae60]/20 text-[#27ae60] text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-3 rounded-xl bg-white dark:bg-[#18191d] border border-[#22211f]/10 dark:border-white/10">
          <div className="flex items-center gap-1 w-full sm:w-auto">
            {(["All", "Active", "Archived"] as const).map((tab) => (
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
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#22211f]/40 dark:text-white/40" />
            <input
              type="text"
              placeholder="Search company, contact, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white placeholder-[#22211f]/40 dark:placeholder-white/40 focus:outline-hidden focus:border-[#d94e34]"
            />
          </div>
        </div>

        {/* Clients Cards Grid */}
        <div className="mt-6">
          {loading ? (
            <div className="p-16 text-center text-xs font-mono text-[#22211f]/40 dark:text-white/40">
              Loading enterprise clients...
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#18191d] border border-dashed border-[#22211f]/15 dark:border-white/15 text-xs font-mono text-[#22211f]/50 dark:text-white/50">
              No client records found. Click "Add Client" above to register an account.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="bg-white dark:bg-[#18191d] rounded-2xl border border-[#22211f]/10 dark:border-white/10 p-6 shadow-xs flex flex-col justify-between hover:border-[#d94e34]/40 transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-[#d94e34]" />
                        <h3 className="font-serif text-lg font-bold text-[#22211f] dark:text-white">
                          {client.company}
                        </h3>
                      </div>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                          client.status === "Active"
                            ? "bg-[#27ae60]/10 text-[#27ae60] border border-[#27ae60]/20"
                            : "bg-[#22211f]/10 text-[#22211f]/60 dark:text-white/60 border border-[#22211f]/10 dark:border-white/10"
                        }`}
                      >
                        {client.status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-xs">
                      {client.contactName && (
                        <div className="text-[#22211f]/70 dark:text-white/70">
                          Contact: <span className="font-semibold text-[#22211f] dark:text-white">{client.contactName}</span>
                        </div>
                      )}
                      {client.email && (
                        <div className="flex items-center gap-1.5 text-[#22211f]/60 dark:text-white/60 font-mono text-[11px]">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{client.email}</span>
                        </div>
                      )}
                      {client.role && (
                        <div className="flex items-center gap-1.5 text-[#22211f]/60 dark:text-white/60 font-mono text-[11px]">
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>{client.role}</span>
                        </div>
                      )}
                      {client.totalBilled && (
                        <div className="flex items-center gap-1.5 text-[#27ae60] font-mono text-xs font-semibold pt-1">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>{client.totalBilled} Lifetime Contracted</span>
                        </div>
                      )}
                    </div>

                    {client.assignedProjects && client.assignedProjects.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[#22211f]/5 dark:border-white/5">
                        <span className="font-mono text-[10px] uppercase text-[#22211f]/40 dark:text-white/40 block mb-1.5">
                          Assigned SOW Scopes
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {client.assignedProjects.map((p) => (
                            <span
                              key={p}
                              className="px-2 py-0.5 rounded bg-[#f6f4ee] dark:bg-[#121316] text-[10px] font-mono text-[#22211f]/70 dark:text-white/70"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {!isReadOnly && (
                    <div className="mt-6 pt-4 border-t border-[#22211f]/10 dark:border-white/10 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(client)}
                        className="p-1.5 rounded-lg border border-[#22211f]/15 dark:border-white/15 text-xs font-mono hover:border-[#d94e34] hover:text-[#d94e34] transition-colors"
                        title="Edit client"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id, client.company)}
                        className="p-1.5 rounded-lg border border-[#22211f]/15 dark:border-white/15 text-xs font-mono text-neutral-400 hover:text-red-500 hover:border-red-500/30 transition-colors"
                        title="Delete client"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modular Client Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveClient}
        editingClient={editingClient}
      />
    </div>
  );
}
