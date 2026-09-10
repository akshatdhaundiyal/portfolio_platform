"use client";

import React, { useState, useEffect } from "react";
import { X, Building } from "lucide-react";
import type { ClientItem } from "@/lib/data/clients";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: Partial<ClientItem>) => Promise<void>;
  editingClient: ClientItem | null;
}

export default function ClientModal({
  isOpen,
  onClose,
  onSave,
  editingClient,
}: ClientModalProps) {
  const [form, setForm] = useState<Partial<ClientItem>>({
    company: "",
    contactName: "",
    email: "",
    role: "Lead Analytics Architect",
    status: "Active",
    assignedProjects: [],
    totalBilled: "$0",
    notes: "",
  });
  const [projectsInput, setProjectsInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingClient) {
      setForm({ ...editingClient });
      setProjectsInput(editingClient.assignedProjects?.join(", ") || "");
    } else {
      setForm({
        company: "",
        contactName: "",
        email: "",
        role: "Lead Analytics Architect",
        status: "Active",
        assignedProjects: [],
        totalBilled: "$0",
        notes: "",
      });
      setProjectsInput("");
    }
  }, [editingClient, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company) {
      alert("Company name is required.");
      return;
    }

    const payload: Partial<ClientItem> = {
      ...form,
      assignedProjects: projectsInput
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
    };

    setSaving(true);
    try {
      await onSave(payload);
      onClose();
    } catch (err: any) {
      alert(err.message || "Failed to save client.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-[#18191d] rounded-2xl border border-[#22211f]/10 dark:border-white/10 shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#22211f]/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-[#d94e34]" />
            <h2 className="text-lg font-serif font-bold text-[#22211f] dark:text-white">
              {editingClient ? "Edit Client Account" : "Add Enterprise Client"}
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
          <div>
            <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              required
              value={form.company || ""}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1">
                Primary Contact
              </label>
              <input
                type="text"
                value={form.contactName || ""}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white"
              />
            </div>
            <div>
              <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1">
                Billing Email
              </label>
              <input
                type="email"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1">
                Engagement Role
              </label>
              <input
                type="text"
                value={form.role || ""}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white"
              />
            </div>
            <div>
              <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1">
                Account Status
              </label>
              <select
                value={form.status || "Active"}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-mono"
              >
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1">
              Assigned SOW Projects (Comma Separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Actuarial Pricing Engine, Claims NLP Triage"
              value={projectsInput}
              onChange={(e) => setProjectsInput(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white"
            />
          </div>

          <div>
            <label className="block font-mono uppercase tracking-wider text-[10px] text-[#22211f]/60 dark:text-white/60 mb-1">
              Lifetime Billed Total
            </label>
            <input
              type="text"
              placeholder="$327,000"
              value={form.totalBilled || ""}
              onChange={(e) => setForm({ ...form, totalBilled: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-mono"
            />
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
              {editingClient ? "Save Changes" : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
