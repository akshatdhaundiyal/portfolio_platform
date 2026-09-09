"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Check,
  Edit2,
  KeyRound,
  Layers,
  Lock,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
  FileText,
} from "lucide-react";
import type { ProjectItem, ArtifactSkin, ProjectSection, ProjectStatus } from "@/lib/data/projects";

const AVAILABLE_SKINS: { value: ArtifactSkin; label: string; desc: string }[] = [
  { value: "boarding-pass", label: "Boarding Pass Ticket", desc: "Perforated tear notches, barcode, red rubber stamp" },
  { value: "baggage-tag", label: "Baggage Inspection Tag", desc: "Clipped corners, metal eyelet ring, string loop" },
  { value: "retro-crt", label: "Retro CRT Monitor", desc: "Bezel chassis, phosphor scanlines, power switch" },
  { value: "garment-tag", label: "Garment Fabric Care Tag", desc: "Stitch line, care icons, cut-along-line" },
  { value: "spiral-notebook", label: "Wire Spiral Sketchbook", desc: "Metallic wire coil loops, red margin rule" },
];

const SECTIONS: { value: ProjectSection; label: string }[] = [
  { value: "currently-cooking", label: "Currently cooking ☺︎" },
  { value: "recently-made", label: "Recently Made ▶" },
  { value: "other-work", label: "Other Work ⁕" },
];

export default function AdminProjectsStudio() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Projects state
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [orderDirty, setOrderDirty] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Editor Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<ProjectItem>>({
    title: "",
    slug: "",
    subtitle: "",
    category: "Enterprise AI & Systems",
    role: "Lead Analytics Architect",
    organization: "EXL Service",
    period: "2024",
    accentColor: "#d94e34",
    metricValue: "+$12M",
    metricLabel: "Annual Premium Recovery",
    summary: "",
    context: "",
    learntThat: "",
    architecture: [],
    techStack: [],
    artifactSkin: "boarding-pass",
    section: "recently-made",
    status: "Shipped",
    displayOrder: 1,
    featured: true,
    githubUrl: "",
    liveUrl: "",
  });

  const [techInput, setTechInput] = useState("");
  const [archInput, setArchInput] = useState("");

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth");
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
      if (data.authenticated) {
        fetchProjects();
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
        fetchProjects();
      } else {
        setAuthError(data.error || "Invalid Passcode");
      }
    } catch {
      setAuthError("Network error. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setIsAuthenticated(false);
  };

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Reorder controls
  const moveProject = (index: number, direction: "up" | "down") => {
    const newProjects = [...projects];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newProjects.length) return;

    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    // Re-assign displayOrder numbers
    newProjects.forEach((p, idx) => {
      p.displayOrder = idx + 1;
    });

    setProjects(newProjects);
    setOrderDirty(true);
  };

  const updateOrderNumber = (id: string, newOrder: number) => {
    const newProjects = projects.map((p) =>
      p.id === id ? { ...p, displayOrder: newOrder } : p
    );
    newProjects.sort((a, b) => a.displayOrder - b.displayOrder);
    setProjects(newProjects);
    setOrderDirty(true);
  };

  const saveReorder = async () => {
    setSavingOrder(true);
    try {
      const orders = projects.map((p, idx) => ({
        id: p.id,
        displayOrder: p.displayOrder ?? idx + 1,
      }));

      const res = await fetch("/api/projects/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders }),
      });

      if (res.ok) {
        setOrderDirty(false);
        setFeedbackMsg("Display order updated successfully!");
        setTimeout(() => setFeedbackMsg(""), 3000);
      } else {
        alert("Failed to save reorder");
      }
    } catch {
      alert("Error saving reorder");
    } finally {
      setSavingOrder(false);
    }
  };

  // Open editor for creating or editing
  const openEditor = (project?: ProjectItem) => {
    if (project) {
      setEditingId(project.id);
      setForm({
        ...project,
      });
      setTechInput(project.techStack?.join(", ") || "");
      setArchInput(project.architecture?.join("\n") || "");
    } else {
      setEditingId(null);
      setForm({
        title: "",
        slug: "",
        subtitle: "",
        category: "Enterprise AI & Systems",
        role: "Lead Analytics Architect",
        organization: "EXL Service",
        period: "2024",
        accentColor: "#d94e34",
        metricValue: "+$12M",
        metricLabel: "Annual Premium Recovery",
        summary: "",
        context: "",
        learntThat: "",
        architecture: [],
        techStack: [],
        artifactSkin: "boarding-pass",
        section: "recently-made",
        status: "Shipped",
        displayOrder: projects.length + 1,
        featured: true,
        githubUrl: "",
        liveUrl: "",
      });
      setTechInput("");
      setArchInput("");
    }
    setIsEditorOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      alert("Title is required");
      return;
    }

    const payload: Partial<ProjectItem> = {
      ...form,
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      techStack: techInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      architecture: archInput
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/projects/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setIsEditorOpen(false);
        fetchProjects();
        setFeedbackMsg("Project saved successfully!");
        setTimeout(() => setFeedbackMsg(""), 3000);
      } else {
        alert("Failed to save project");
      }
    } catch {
      alert("Error saving project");
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProjects();
      }
    } catch {
      alert("Failed to delete project");
    }
  };

  // Render Login Form if not authed
  if (isAuthenticated === false) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md p-8 rounded-2xl bg-[#16171c] border border-white/10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#d94e34]/20 text-[#d94e34] mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-white">Super Admin Access</h1>
            <p className="font-mono text-xs text-neutral-400">
              Enter master passcode to access the Projects & Artifacts Studio.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-mono text-xs text-neutral-300">Master Passcode</label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-[#d94e34]"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-neutral-500 absolute right-3 top-3" />
              </div>
              {authError && <p className="font-mono text-xs text-red-400 mt-1">{authError}</p>}
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 rounded-lg bg-[#d94e34] hover:bg-[#c43f27] text-white font-mono text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              {authLoading ? "Verifying..." : "Unlock Studio"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Studio Header & Top Navigation Tabs */}
      <div className="space-y-4 border-b border-white/[0.08] pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs text-emerald-400 uppercase tracking-wider font-bold">
                SUPER ADMIN STUDIO
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-white font-bold tracking-tight">
              Projects & Physical Artifacts Studio
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openEditor()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#d94e34] hover:bg-[#c43f27] text-white font-mono text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-neutral-400 hover:text-white transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="flex items-center gap-3 pt-2">
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-neutral-400 hover:text-white font-mono text-xs transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Articles Studio (Medium)</span>
          </Link>

          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f4ede2] text-[#121316] font-mono text-xs font-bold shadow-sm"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Projects & Content Order</span>
          </Link>
        </div>
      </div>

      {/* Reorder Save Notification Bar */}
      {orderDirty && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-amber-300 font-mono text-xs">
          <span>You have unsaved changes to the project display order!</span>
          <button
            onClick={saveReorder}
            disabled={savingOrder}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingOrder ? "Saving..." : "Save Order"}</span>
          </button>
        </div>
      )}

      {feedbackMsg && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
          {feedbackMsg}
        </div>
      )}

      {/* Projects Table / Manager */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#16171c] overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between font-mono text-xs text-neutral-400">
          <span>PROJECTS DIRECTORY ({projects.length} Total)</span>
          <button
            onClick={fetchProjects}
            className="flex items-center gap-1 hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {projects.map((proj, idx) => (
            <div
              key={proj.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
            >
              {/* Order & Reorder arrows */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveProject(idx, "up")}
                    disabled={idx === 0}
                    className="p-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => moveProject(idx, "down")}
                    disabled={idx === projects.length - 1}
                    className="p-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex flex-col items-center">
                  <span className="font-mono text-[10px] text-neutral-500 uppercase">Priority</span>
                  <input
                    type="number"
                    value={proj.displayOrder ?? idx + 1}
                    onChange={(e) => updateOrderNumber(proj.id, parseInt(e.target.value) || 0)}
                    className="w-12 text-center py-1 rounded bg-black/40 border border-white/10 font-mono text-xs text-white font-bold"
                  />
                </div>

                {/* Project Details */}
                <div className="space-y-1 ml-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-white">
                      {proj.title}
                    </h3>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#d94e34]/20 text-[#d94e34] border border-[#d94e34]/30 font-bold">
                      {proj.artifactSkin}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-neutral-400">
                    <span className="text-amber-400">[{proj.section}]</span>
                    <span>•</span>
                    <span>{proj.category}</span>
                    <span>•</span>
                    <span className="text-emerald-400">{proj.metricValue}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => openEditor(proj)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 font-mono text-xs border border-white/10 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDeleteProject(proj.id)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                  title="Delete Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit / Create Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#18191e] border border-white/15 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-serif text-2xl font-bold text-white">
                {editingId ? "Edit Project & Artifact Skin" : "Add New Project"}
              </h2>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-5 font-mono text-xs">
              
              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-neutral-300">Project Title *</label>
                  <input
                    type="text"
                    value={form.title || ""}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Actuarial Pricing & GLM Triage"
                    className="w-full px-3 py-2 rounded bg-black/40 border border-white/15 text-white font-sans text-sm focus:outline-none focus:border-[#d94e34]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-300">URL Slug</label>
                  <input
                    type="text"
                    value={form.slug || ""}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="e.g. actuarial-glm-pricing"
                    className="w-full px-3 py-2 rounded bg-black/40 border border-white/15 text-neutral-300 text-xs focus:outline-none focus:border-[#d94e34]"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div className="space-y-1.5">
                <label className="text-neutral-300">Subtitle / Editorial Pitch</label>
                <input
                  type="text"
                  value={form.subtitle || ""}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="e.g. Decomposing Enterprise Policy Risk into a Two-Stage Statistical Triage Matrix"
                  className="w-full px-3 py-2 rounded bg-black/40 border border-white/15 text-white font-sans text-xs focus:outline-none focus:border-[#d94e34]"
                />
              </div>

              {/* Artifact Skin & Section Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/[0.02] p-4 rounded-xl border border-white/[0.08]">
                <div className="space-y-1.5">
                  <label className="text-amber-400 font-bold">Physical Artifact Skin</label>
                  <select
                    value={form.artifactSkin || "boarding-pass"}
                    onChange={(e) => setForm({ ...form, artifactSkin: e.target.value as ArtifactSkin })}
                    className="w-full px-3 py-2 rounded bg-black/60 border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-[#d94e34]"
                  >
                    {AVAILABLE_SKINS.map((skin) => (
                      <option key={skin.value} value={skin.value}>
                        {skin.label}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-neutral-400 block mt-1">
                    {AVAILABLE_SKINS.find((s) => s.value === form.artifactSkin)?.desc}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-amber-400 font-bold">Homepage Section</label>
                  <select
                    value={form.section || "recently-made"}
                    onChange={(e) => setForm({ ...form, section: e.target.value as ProjectSection })}
                    className="w-full px-3 py-2 rounded bg-black/60 border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-[#d94e34]"
                  >
                    {SECTIONS.map((sec) => (
                      <option key={sec.value} value={sec.value}>
                        {sec.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-neutral-300">Metric Value (Callout)</label>
                  <input
                    type="text"
                    value={form.metricValue || ""}
                    onChange={(e) => setForm({ ...form, metricValue: e.target.value })}
                    placeholder="+$12M or 70% or Sub-100ms"
                    className="w-full px-3 py-2 rounded bg-black/40 border border-white/15 text-emerald-400 font-bold"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-neutral-300">Metric Label</label>
                  <input
                    type="text"
                    value={form.metricLabel || ""}
                    onChange={(e) => setForm({ ...form, metricLabel: e.target.value })}
                    placeholder="Annual Audit Premium Recovery"
                    className="w-full px-3 py-2 rounded bg-black/40 border border-white/15 text-white"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1.5">
                <label className="text-neutral-300">Summary & Business Context</label>
                <textarea
                  rows={3}
                  value={form.summary || ""}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Executive summary of the problem, statistical solution, and business impact..."
                  className="w-full px-3 py-2 rounded bg-black/40 border border-white/15 text-white font-sans text-xs focus:outline-none focus:border-[#d94e34]"
                />
              </div>

              {/* Architecture Bullets */}
              <div className="space-y-1.5">
                <label className="text-neutral-300">Architecture Execution (1 per line)</label>
                <textarea
                  rows={3}
                  value={archInput}
                  onChange={(e) => setArchInput(e.target.value)}
                  placeholder="Decomposed target into Binomial GLM and Gamma GLM&#10;Engineered automated Expected Audit Value matrix..."
                  className="w-full px-3 py-2 rounded bg-black/40 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-[#d94e34]"
                />
              </div>

              {/* Tech Stack */}
              <div className="space-y-1.5">
                <label className="text-neutral-300">Tech Stack (Comma-separated)</label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Python, Statsmodels, Actuarial GLMs, PostgreSQL"
                  className="w-full px-3 py-2 rounded bg-black/40 border border-white/15 text-neutral-200"
                />
              </div>

              {/* Retrospective Note */}
              <div className="space-y-1.5">
                <label className="text-neutral-300">Retrospective Note (&quot;Learnt that...&quot;)</label>
                <textarea
                  rows={2}
                  value={form.learntThat || ""}
                  onChange={(e) => setForm({ ...form, learntThat: e.target.value })}
                  placeholder="In enterprise AI, stakeholder adoption is governed by explainability and unit economics..."
                  className="w-full px-3 py-2 rounded bg-black/40 border border-white/15 text-neutral-300 font-sans italic text-xs focus:outline-none focus:border-[#d94e34]"
                />
              </div>

              {/* Repository & Live Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-neutral-300">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={form.githubUrl || ""}
                    onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                    placeholder="https://github.com/akshatdhaundiyal/..."
                    className="w-full px-3 py-2 rounded bg-black/40 border border-white/15 text-neutral-300 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-300">Live URL (Optional)</label>
                  <input
                    type="url"
                    value={form.liveUrl || ""}
                    onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded bg-black/40 border border-white/15 text-neutral-300 text-xs"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#d94e34] hover:bg-[#c43f27] text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  Save Project & Artifact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
