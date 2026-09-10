"use client";

import React, { useState, useEffect } from "react";
import { X, Layers, Save } from "lucide-react";
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

interface ProjectEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: Partial<ProjectItem>) => Promise<void>;
  editingProject: ProjectItem | null;
}

export default function ProjectEditorModal({
  isOpen,
  onClose,
  onSave,
  editingProject,
}: ProjectEditorModalProps) {
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingProject) {
      setForm({ ...editingProject });
      setTechInput(editingProject.techStack?.join(", ") || "");
      setArchInput(editingProject.architecture?.join("\n") || "");
    } else {
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
        displayOrder: 1,
        featured: true,
        githubUrl: "",
        liveUrl: "",
      });
      setTechInput("");
      setArchInput("");
    }
  }, [editingProject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      alert("Title is required.");
      return;
    }

    const payload: Partial<ProjectItem> = {
      ...form,
      techStack: techInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      architecture: archInput
        .split("\n")
        .map((a) => a.trim())
        .filter(Boolean),
    };

    setSaving(true);
    try {
      await onSave(payload);
      onClose();
    } catch (err: any) {
      alert(err.message || "Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#18191e] border border-[#22211f]/10 dark:border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#22211f]/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#d94e34]" />
            <h3 className="font-serif text-lg font-bold text-[#22211f] dark:text-white">
              {editingProject ? `Edit Project: ${editingProject.title}` : "Create New Project Artifact"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#22211f]/40 dark:text-white/40 hover:bg-[#22211f]/5 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={form.title || ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Actuarial Pricing & GLM Triage"
                className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-serif text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-1">
                Slug (URL Identifier)
              </label>
              <input
                type="text"
                value={form.slug || ""}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="actuarial-pricing-glm-triage"
                className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-1">
                Role
              </label>
              <input
                type="text"
                value={form.role || ""}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-1">
                Organization / Client
              </label>
              <input
                type="text"
                value={form.organization || ""}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-1">
                Period / Year
              </label>
              <input
                type="text"
                value={form.period || ""}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white"
              />
            </div>
          </div>

          {/* Physical Artifact Skin Selector */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-2">
              Physical Artifact Skin
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {AVAILABLE_SKINS.map((skin) => (
                <button
                  type="button"
                  key={skin.value}
                  onClick={() => setForm({ ...form, artifactSkin: skin.value })}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    form.artifactSkin === skin.value
                      ? "border-[#d94e34] bg-[#d94e34]/10 dark:bg-[#d94e34]/15"
                      : "border-[#22211f]/10 dark:border-white/10 bg-[#f6f4ee]/50 dark:bg-[#121316]/50 hover:border-[#22211f]/30"
                  }`}
                >
                  <div className="font-semibold text-[#22211f] dark:text-white">{skin.label}</div>
                  <div className="text-[10px] text-[#22211f]/50 dark:text-white/50 line-clamp-1 mt-0.5">
                    {skin.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-1">
                Verified Metric Value
              </label>
              <input
                type="text"
                value={form.metricValue || ""}
                onChange={(e) => setForm({ ...form, metricValue: e.target.value })}
                placeholder="+$12M"
                className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-bold text-[#d94e34]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-1">
                Metric Label
              </label>
              <input
                type="text"
                value={form.metricLabel || ""}
                onChange={(e) => setForm({ ...form, metricLabel: e.target.value })}
                placeholder="Annual Premium Recovery"
                className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-1">
              Tech Stack (Comma Separated)
            </label>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="Python, Polars, GLM, Docker, Next.js"
              className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-1">
              Architecture & Execution Highlights (1 per line)
            </label>
            <textarea
              rows={3}
              value={archInput}
              onChange={(e) => setArchInput(e.target.value)}
              placeholder="Two-stage GLM model triage&#10;Sub-100ms distributed pipeline"
              className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-1">
              Executive Summary / Abstract
            </label>
            <textarea
              rows={2}
              value={form.summary || ""}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-1">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={form.githubUrl || ""}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-1">
                Live URL
              </label>
              <input
                type="url"
                value={form.liveUrl || ""}
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#22211f]/10 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-[#22211f]/60 dark:text-white/60 hover:bg-[#22211f]/5 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg uppercase tracking-wider font-semibold bg-[#d94e34] hover:bg-[#c23d24] text-white shadow-xs disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Saving..." : "Save Project"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
