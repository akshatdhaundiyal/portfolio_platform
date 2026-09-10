"use client";

import React, { useState, useEffect } from "react";
import StudioNavbar from "@/components/admin/StudioNavbar";
import AdminAuthGate from "@/components/admin/AdminAuthGate";
import BlogTable, { type BlogListItem } from "@/components/admin/blogs/BlogTable";
import BlogEditorModal from "@/components/admin/blogs/BlogEditorModal";
import { Plus, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";
import type { AuthUser } from "@/lib/auth";

export default function AdminBlogsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [blogs, setBlogs] = useState<BlogListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  // Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogListItem | null>(null);
  const [savingBlog, setSavingBlog] = useState(false);

  useEffect(() => {
    fetchSession();
    fetchBlogs();
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

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      if (Array.isArray(data)) setBlogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = user?.role === "guest" || user?.role === "user";

  const handleOpenNew = () => {
    if (isReadOnly) {
      alert("Read-only mode. Publishing articles is disabled.");
      return;
    }
    setEditingBlog(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (blog: BlogListItem) => {
    if (isReadOnly) {
      alert("Read-only mode.");
      return;
    }
    setEditingBlog(blog);
    setIsEditorOpen(true);
  };

  const handleSaveBlog = async (
    payload: any,
    crossPostToMedium: boolean,
    mediumToken: string,
    mediumPublishStatus: "draft" | "public"
  ) => {
    if (isReadOnly) return;
    setSavingBlog(true);

    try {
      let res;
      if (editingBlog) {
        res = await fetch(`/api/blogs/${editingBlog.slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("Failed to save article.");

      // Medium cross-posting
      if (crossPostToMedium && mediumToken) {
        try {
          await fetch("/api/medium", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: payload.title,
              content: payload.content,
              tags: payload.tags,
              publishStatus: mediumPublishStatus,
              token: mediumToken,
            }),
          });
        } catch (mErr) {
          console.error("Medium syndication warning:", mErr);
        }
      }

      setIsEditorOpen(false);
      setFeedback(editingBlog ? "Article updated successfully." : "Article published successfully.");
      setTimeout(() => setFeedback(""), 3000);
      fetchBlogs();
    } catch (err: any) {
      alert(err.message || "Error saving article.");
    } finally {
      setSavingBlog(false);
    }
  };

  const handleDeleteBlog = async (slug: string) => {
    if (isReadOnly) return;
    if (!confirm(`Are you sure you want to delete paper "${slug}"?`)) return;

    try {
      const res = await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed.");
      setFeedback("Article removed.");
      setTimeout(() => setFeedback(""), 3000);
      fetchBlogs();
    } catch (err: any) {
      alert(err.message || "Failed to delete article.");
    }
  };

  const handleSyndicateMedium = (blog: BlogListItem) => {
    setEditingBlog(blog);
    setIsEditorOpen(true);
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
          fetchBlogs();
        }}
        title="Articles Studio Authorization"
        subtitle="Sign in with your author or admin passcode to compose technical papers and syndicate to Medium."
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f4ee] dark:bg-[#121316] text-[#22211f] dark:text-[#ece9e2] flex flex-col md:flex-row antialiased selection:bg-[#d94e34]/20">
      {/* Vertical Left Studio Navbar */}
      <StudioNavbar
        user={user}
        activeRoute="/admin/blogs"
        badgeCounts={{
          articles: blogs.length,
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto max-w-6xl">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-[#22211f]/10 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono bg-[#d94e34]/10 text-[#d94e34] dark:bg-[#d94e34]/20 border border-[#d94e34]/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Studio • Editorial CMS & Medium Syndication</span>
            </div>
            <h1 className="text-3xl font-serif tracking-tight text-[#22211f] dark:text-white">
              Articles & Papers Studio
            </h1>
            <p className="text-sm text-[#22211f]/60 dark:text-white/60 mt-1">
              Author technical systems breakdowns with live split-screen preview, LaTeX math formulas, and 1-click Medium syndication.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenNew}
              disabled={isReadOnly}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold bg-[#d94e34] hover:bg-[#c23d24] text-white shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Write New Article</span>
            </button>
          </div>
        </div>

        {/* Read-Only Notice */}
        {isReadOnly && (
          <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-mono flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>
              Preview Mode Active ({user?.badge}). Writing and syndicating articles is restricted to Admin or Super Admin roles.
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

        {/* Articles Table Component */}
        <div className="mt-8">
          <BlogTable
            blogs={blogs}
            loading={loading}
            isReadOnly={isReadOnly}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteBlog}
            onSyndicateMedium={handleSyndicateMedium}
          />
        </div>
      </main>

      {/* Modular Blog Editor Modal */}
      <BlogEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveBlog}
        editingBlog={editingBlog}
        saving={savingBlog}
      />
    </div>
  );
}
