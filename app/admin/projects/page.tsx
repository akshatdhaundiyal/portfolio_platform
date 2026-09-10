"use client";

import React, { useState, useEffect, Suspense } from "react";
import StudioNavbar from "@/components/admin/StudioNavbar";
import AdminAuthGate from "@/components/admin/AdminAuthGate";
import ProjectEditorModal from "@/components/admin/projects/ProjectEditorModal";
import ProjectOrderList from "@/components/admin/projects/ProjectOrderList";
import {
  Layers,
  Plus,
  Save,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import type { ProjectItem } from "@/lib/data/projects";
import type { AuthUser } from "@/lib/auth";

function ProjectsStudioContent() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderDirty, setOrderDirty] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    fetchSession();
    fetchProjects();
  }, []);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth");
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = user?.role === "guest" || user?.role === "user";

  const handleMoveUp = (index: number) => {
    if (index === 0 || isReadOnly) return;
    const reordered = [...projects];
    const temp = reordered[index - 1];
    reordered[index - 1] = reordered[index];
    reordered[index] = temp;
    reordered.forEach((p, idx) => {
      p.displayOrder = idx + 1;
    });
    setProjects(reordered);
    setOrderDirty(true);
  };

  const handleMoveDown = (index: number) => {
    if (index === projects.length - 1 || isReadOnly) return;
    const reordered = [...projects];
    const temp = reordered[index + 1];
    reordered[index + 1] = reordered[index];
    reordered[index] = temp;
    reordered.forEach((p, idx) => {
      p.displayOrder = idx + 1;
    });
    setProjects(reordered);
    setOrderDirty(true);
  };

  const handleSaveOrder = async () => {
    if (isReadOnly) return;
    setSavingOrder(true);
    try {
      const payload = projects.map((p) => ({ id: p.id, displayOrder: p.displayOrder }));
      const res = await fetch("/api/projects/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders: payload }),
      });
      if (!res.ok) throw new Error("Failed to save display order.");
      setOrderDirty(false);
      setFeedback("Display order saved successfully.");
      setTimeout(() => setFeedback(""), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to persist project order.");
    } finally {
      setSavingOrder(false);
    }
  };

  const handleOpenNew = () => {
    if (isReadOnly) {
      alert("Read-only access. Project authoring is restricted to Admin or Super Admin.");
      return;
    }
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: ProjectItem) => {
    if (isReadOnly) {
      alert("Read-only access.");
      return;
    }
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = async (projectData: Partial<ProjectItem>) => {
    if (isReadOnly) return;
    if (editingProject) {
      const res = await fetch(`/api/projects/${editingProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });
      if (!res.ok) throw new Error("Failed to update project.");
      setFeedback("Project updated successfully.");
    } else {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });
      if (!res.ok) throw new Error("Failed to create project.");
      setFeedback("Project created successfully.");
    }
    setTimeout(() => setFeedback(""), 3000);
    fetchProjects();
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (isReadOnly) return;
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed.");
      setFeedback(`Project "${title}" deleted.`);
      setTimeout(() => setFeedback(""), 3000);
      fetchProjects();
    } catch (err: any) {
      alert(err.message || "Failed to delete project.");
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#f6f4ee] dark:bg-[#121316] flex items-center justify-center p-4">
        <span className="font-mono text-xs text-[#22211f]/60 dark:text-white/60">
          Verifying security session...
        </span>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <AdminAuthGate
        onSuccess={() => {
          setIsAuthenticated(true);
          fetchSession();
          fetchProjects();
        }}
        title="Personal Studio Access"
        subtitle="Enter your role passcode to access personal projects, case studies, and artifact skins."
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f4ee] dark:bg-[#121316] text-[#22211f] dark:text-[#ece9e2] flex flex-col md:flex-row antialiased selection:bg-[#d94e34]/20">
      {/* Vertical Left Studio Navbar */}
      <StudioNavbar
        user={user}
        activeRoute="/admin/projects"
        badgeCounts={{
          projects: projects.length,
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto max-w-6xl">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-[#22211f]/10 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono bg-[#d94e34]/10 text-[#d94e34] dark:bg-[#d94e34]/20 border border-[#d94e34]/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Studio • Projects & Physical Artifacts</span>
            </div>
            <h1 className="text-3xl font-serif tracking-tight text-[#22211f] dark:text-white">
              Projects & Showcase Workbench
            </h1>
            <p className="text-sm text-[#22211f]/60 dark:text-white/60 mt-1">
              Curate high-leverage ML case studies, configure tactile artifact skins, and persist live portfolio display order.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {orderDirty && !isReadOnly && (
              <button
                onClick={handleSaveOrder}
                disabled={savingOrder}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold bg-[#27ae60] hover:bg-[#219150] text-white shadow-xs transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingOrder ? "Saving Order..." : "Save Order"}</span>
              </button>
            )}

            <button
              onClick={handleOpenNew}
              disabled={isReadOnly}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold bg-[#d94e34] hover:bg-[#c23d24] text-white shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
          </div>
        </div>

        {/* Read-Only Notice */}
        {isReadOnly && (
          <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-mono flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>
              Preview Mode Active ({user?.badge}). Editing and reordering projects is restricted to Admin or Super Admin roles.
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

        {/* Projects List Component */}
        <div className="mt-8">
          {loading ? (
            <div className="p-16 text-center text-xs font-mono text-[#22211f]/40 dark:text-white/40">
              Loading project artifacts...
            </div>
          ) : (
            <ProjectOrderList
              projects={projects}
              isReadOnly={isReadOnly}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteProject}
            />
          )}
        </div>
      </main>

      {/* Modular Project Editor Modal */}
      <ProjectEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        editingProject={editingProject}
      />
    </div>
  );
}

export default function AdminProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f6f4ee] dark:bg-[#121316] flex items-center justify-center font-mono text-xs text-[#22211f]/60 dark:text-white/60">
          Loading studio...
        </div>
      }
    >
      <ProjectsStudioContent />
    </Suspense>
  );
}
