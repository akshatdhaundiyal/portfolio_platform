"use client";

import React, { useState, useEffect } from "react";
import BlogContentRenderer from "@/components/BlogContentRenderer";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  Eye,
  FileEdit,
  Image as ImageIcon,
  KeyRound,
  Lightbulb,
  Lock,
  LogOut,
  Play,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  Upload,
  Video,
  X,
  Layers,
} from "lucide-react";
import Link from "next/link";

interface BlogItem {
  id?: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  summary: string;
  readTime: string;
  tags: string[];
  featured: boolean;
  content: string;
  coverImage?: string;
  status: "published" | "draft";
  mediumUrl?: string | null;
  mediumPostId?: string | null;
}

export default function AdminBlogStudio() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Blogs State
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);

  // Editor Modal / Mode
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("split");

  // Form State
  const [formData, setFormData] = useState<BlogItem>({
    slug: "",
    title: "",
    subtitle: "",
    category: "Applied ML",
    summary: "",
    readTime: "5 min read",
    tags: ["Machine Learning", "System Design"],
    featured: false,
    content: "",
    coverImage: "",
    status: "published",
  });
  const [tagsInput, setTagsInput] = useState("Machine Learning, System Design");

  // Medium Cross-Posting State
  const [crossPostToMedium, setCrossPostToMedium] = useState(false);
  const [mediumToken, setMediumToken] = useState("");
  const [mediumPublishStatus, setMediumPublishStatus] = useState<"draft" | "public">("draft");
  const [savingBlog, setSavingBlog] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ success?: string; error?: string } | null>(null);

  // Media Insertion Modals
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState("python");
  const [codeSnippet, setCodeSnippet] = useState("");

  // Check auth on mount
  useEffect(() => {
    checkAuth();
    // Load saved Medium token from localStorage
    const savedToken = localStorage.getItem("medium_integration_token");
    if (savedToken) setMediumToken(savedToken);
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth");
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
      if (data.authenticated) {
        fetchBlogs();
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
        body: JSON.stringify({ password: passcode }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }
      setIsAuthenticated(true);
      fetchBlogs();
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setIsAuthenticated(false);
  };

  const fetchBlogs = async () => {
    setLoadingBlogs(true);
    try {
      const res = await fetch("/api/blogs?all=true");
      const data = await res.json();
      if (Array.isArray(data)) {
        setBlogs(data);
      }
    } catch (err) {
      console.error("Failed to load blogs:", err);
    } finally {
      setLoadingBlogs(false);
    }
  };

  // Open editor for new blog
  const handleOpenNew = () => {
    setEditingSlug(null);
    setFormData({
      slug: "",
      title: "",
      subtitle: "",
      category: "Applied ML",
      summary: "",
      readTime: "6 min read",
      tags: ["Applied ML", "Systems"],
      featured: false,
      content: `# Title Here\n\nWrite your introduction here...\n\n---\n\n## 1. Problem Statement\n\nExplain the opportunity...\n`,
      coverImage: "",
      status: "published",
    });
    setTagsInput("Applied ML, Systems");
    setSaveStatus(null);
    setIsEditorOpen(true);
  };

  // Open editor for existing blog
  const handleOpenEdit = (blog: BlogItem) => {
    setEditingSlug(blog.slug);
    setFormData(blog);
    setTagsInput(blog.tags.join(", "));
    setSaveStatus(null);
    setIsEditorOpen(true);
  };

  // Delete blog
  const handleDeleteBlog = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete the paper "${slug}"?`)) return;
    try {
      const res = await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
      if (res.ok) {
        setBlogs(blogs.filter((b) => b.slug !== slug));
      }
    } catch (err) {
      alert("Failed to delete blog.");
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!editingSlug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, title, slug: generatedSlug }));
    } else {
      setFormData((prev) => ({ ...prev, title }));
    }
  };

  // Insert markdown helper into content
  const insertContent = (snippet: string) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content + "\n\n" + snippet + "\n",
    }));
  };

  // Upload image handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      insertContent(`![${imageCaption || file.name}](${result.url})`);
      setImageModalOpen(false);
      setImageCaption("");
      setImageUrl("");
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Blog
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBlog(true);
    setSaveStatus(null);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      tags,
    };

    try {
      const isEdit = Boolean(editingSlug);
      const url = isEdit ? `/api/blogs/${editingSlug}` : "/api/blogs";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save blog");

      // Save Medium token to localStorage if provided
      if (mediumToken) {
        localStorage.setItem("medium_integration_token", mediumToken.trim());
      }

      // If Medium cross-posting is enabled, trigger Medium syndication
      let mediumMessage = "";
      if (crossPostToMedium) {
        try {
          const mediumRes = await fetch("/api/medium", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slug: payload.slug,
              token: mediumToken,
              publishStatus: mediumPublishStatus,
            }),
          });
          const mediumData = await mediumRes.json();
          if (mediumRes.ok) {
            mediumMessage = ` · Also cross-published to Medium (${mediumData.publishStatus}): ${mediumData.mediumUrl}`;
          } else {
            mediumMessage = ` · Note: Medium sync failed: ${mediumData.error}`;
          }
        } catch (mediumErr: any) {
          mediumMessage = ` · Note: Medium sync error: ${mediumErr.message}`;
        }
      }

      setSaveStatus({
        success: `Paper "${payload.title}" saved successfully!${mediumMessage}`,
      });

      fetchBlogs();
    } catch (err: any) {
      setSaveStatus({ error: err.message });
    } finally {
      setSavingBlog(false);
    }
  };

  // 1. Passcode Login Modal if not authenticated
  if (isAuthenticated === false) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 space-y-6">
        <div className="artifact-card rounded-2xl p-8 space-y-6 border border-black/10 dark:border-white/[0.1]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Super Admin Studio</h2>
              <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400">Master Secret Passcode Required</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-neutral-600 dark:text-neutral-400 mb-1.5">
                ADMIN_PASSWORD
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter secret passcode..."
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/[0.1] text-sm text-neutral-900 dark:text-white font-mono placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
                <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              </div>
            </div>

            {authError && (
              <div className="text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
            >
              {authLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Unlock Studio</span>}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="py-24 text-center font-mono text-xs text-neutral-500">
        Verifying security session...
      </div>
    );
  }

  // 3. Super Admin Studio Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Studio Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 dark:border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-mono text-xs mb-2">
            <Sparkles className="w-3 h-3" />
            <span>SUPER ADMIN // DYNAMIC BLOG & MEDIUM STUDIO</span>
          </div>
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white tracking-tight">
            Article Management & Syndication
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Create rich articles with responsive media embeds and cross-publish to Medium with canonical SEO protection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenNew}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Paper</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.03] border border-black/10 dark:border-white/[0.08] text-neutral-600 dark:text-neutral-400 hover:text-rose-500 hover:border-rose-500/30 transition-all cursor-pointer"
            title="Lock Studio"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Studio Navigation Tabs */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/blogs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f4ede2] text-[#121316] font-mono text-xs font-bold shadow-sm"
        >
          <span>Articles Studio (Medium)</span>
        </Link>

        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/[0.04] dark:bg-white/[0.04] border border-black/10 dark:border-white/[0.08] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-mono text-xs transition-colors"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Projects & Content Order</span>
        </Link>
      </div>

      {/* Articles Management Table */}
      <div className="artifact-card rounded-2xl overflow-hidden border border-white/[0.08]">
        <div className="p-4 bg-white/[0.02] border-b border-white/[0.08] flex items-center justify-between font-mono text-xs">
          <span className="text-neutral-300 font-semibold">ALL PUBLISHED & DRAFT PAPERS</span>
          <span className="text-neutral-500">{blogs.length} entries</span>
        </div>

        {loadingBlogs ? (
          <div className="p-8 text-center font-mono text-xs text-neutral-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Loading articles...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/[0.02] text-neutral-400 border-b border-white/[0.06]">
                <tr>
                  <th className="p-4">Title & Slug</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Medium Sync</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {blogs.map((b) => (
                  <tr key={b.slug} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="font-sans font-semibold text-white text-sm">{b.title}</div>
                      <div className="text-neutral-500 text-[11px] font-mono">/blog/{b.slug}</div>
                    </td>
                    <td className="p-4 text-indigo-300">{b.category}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          b.status === "published"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {b.mediumUrl ? (
                        <a
                          href={b.mediumUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#00AB6C] hover:underline"
                        >
                          <span>Cross-Posted ↗</span>
                        </a>
                      ) : (
                        <span className="text-neutral-600">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/blog/${b.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-neutral-300 hover:text-white inline-flex"
                        title="View Live Paper"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleOpenEdit(b)}
                        className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-neutral-300 hover:text-cyan-300 inline-flex"
                        title="Edit Paper"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(b.slug)}
                        className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-neutral-400 hover:text-rose-400 inline-flex"
                        title="Delete Paper"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Editor Modal / Canvas */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col p-2 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto bg-[#0a0b0e] border border-white/[0.12] rounded-2xl shadow-2xl flex flex-col flex-1 overflow-hidden my-auto">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span className="font-mono text-sm text-white font-semibold">
                  {editingSlug ? `Editing: ${editingSlug}` : "New Dynamic Paper"}
                </span>
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center p-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setViewMode("edit")}
                    className={`px-2.5 py-1 rounded ${viewMode === "edit" ? "bg-white/[0.1] text-white" : "text-neutral-400"}`}
                  >
                    Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("split")}
                    className={`px-2.5 py-1 rounded ${viewMode === "split" ? "bg-white/[0.1] text-white" : "text-neutral-400"}`}
                  >
                    Split
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("preview")}
                    className={`px-2.5 py-1 rounded ${viewMode === "preview" ? "bg-white/[0.1] text-white" : "text-neutral-400"}`}
                  >
                    Preview
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveBlog} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Metadata Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-8 space-y-1">
                    <label className="font-mono text-[11px] text-neutral-400">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={handleTitleChange}
                      required
                      placeholder="e.g. Form Follows Function: Applied ML Lessons"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.1] text-sm text-white font-medium focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="md:col-span-4 space-y-1">
                    <label className="font-mono text-[11px] text-neutral-400">Slug (URL)</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                      placeholder="e.g. form-follows-function-applied-ml"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.1] text-xs font-mono text-neutral-300 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="md:col-span-6 space-y-1">
                    <label className="font-mono text-[11px] text-neutral-400">Subtitle</label>
                    <input
                      type="text"
                      value={formData.subtitle || ""}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="Why eliminating vanity complexity leads to high-leverage predictive systems..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.1] text-xs text-neutral-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="md:col-span-3 space-y-1">
                    <label className="font-mono text-[11px] text-neutral-400">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0f1117] border border-white/[0.1] text-xs text-neutral-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Applied ML">Applied ML</option>
                      <option value="Enterprise AI">Enterprise AI</option>
                      <option value="NLP & Cloud">NLP & Cloud</option>
                      <option value="Design Systems">Design Systems</option>
                      <option value="Product Strategy">Product Strategy</option>
                    </select>
                  </div>

                  <div className="md:col-span-3 space-y-1">
                    <label className="font-mono text-[11px] text-neutral-400">Read Time</label>
                    <input
                      type="text"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      placeholder="e.g. 6 min read"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.1] text-xs text-neutral-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="md:col-span-8 space-y-1">
                    <label className="font-mono text-[11px] text-neutral-400">Summary / Abstract</label>
                    <input
                      type="text"
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      placeholder="Brief abstract displayed on portfolio cards..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.1] text-xs text-neutral-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="md:col-span-4 space-y-1">
                    <label className="font-mono text-[11px] text-neutral-400">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="Machine Learning, Python, MLOps"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.1] text-xs font-mono text-neutral-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Dynamic Content Insert Toolbar */}
                <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                  <span className="text-[11px] font-mono text-neutral-400 px-2 uppercase tracking-wider">
                    Insert Block:
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => setImageModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-cyan-300 border border-white/[0.08] transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Image Asset</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVideoModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-rose-300 border border-white/[0.08] transition-colors"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Video / MP4 Embed</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCodeModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-emerald-300 border border-white/[0.08] transition-colors"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Code Block</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      insertContent(
                        `> "Learnt that in enterprise machine learning, systems stripped of vanity complexity yield 10x higher stakeholder adoption."`
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-amber-300 border border-white/[0.08] transition-colors"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Learnt Callout</span>
                  </button>
                </div>

                {/* Editor / Preview Canvas */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[420px]">
                  {/* Markdown Input */}
                  {(viewMode === "edit" || viewMode === "split") && (
                    <div className={`${viewMode === "split" ? "md:col-span-6" : "md:col-span-12"} flex flex-col`}>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        required
                        placeholder="Write rich markdown here... use toolbar buttons above to insert images, videos, and code blocks!"
                        className="w-full h-full min-h-[420px] p-4 rounded-xl bg-[#07080c] border border-white/[0.1] text-xs sm:text-sm font-mono text-neutral-200 leading-relaxed focus:outline-none focus:border-indigo-500 font-normal"
                      />
                    </div>
                  )}

                  {/* Live Render Preview */}
                  {(viewMode === "preview" || viewMode === "split") && (
                    <div className={`${viewMode === "split" ? "md:col-span-6" : "md:col-span-12"} p-6 rounded-xl bg-white/[0.02] border border-white/[0.08] overflow-y-auto max-h-[500px]`}>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 pb-4 border-b border-white/[0.06] flex items-center justify-between">
                        <span>LIVE ARTICLE PREVIEW</span>
                        <span className="text-emerald-400">WYSIWYG ACTIVE</span>
                      </div>
                      <div className="pt-4">
                        <BlogContentRenderer content={formData.content} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Medium Cross-Posting & Syndication Bar */}
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-[#00AB6C] flex items-center justify-center font-bold text-black text-xs">
                        M
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white">Cross-post to Medium</span>
                        <p className="text-[11px] font-mono text-neutral-400">
                          Automatically syndicates with canonicalUrl attribution to protect your site&apos;s SEO.
                        </p>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={crossPostToMedium}
                        onChange={(e) => setCrossPostToMedium(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/[0.1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00AB6C]"></div>
                    </label>
                  </div>

                  {crossPostToMedium && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 border-t border-white/[0.06] animate-in fade-in">
                      <div className="md:col-span-8 space-y-1">
                        <label className="font-mono text-[11px] text-neutral-400">
                          Medium Integration Token (Saved in localStorage)
                        </label>
                        <input
                          type="password"
                          value={mediumToken}
                          onChange={(e) => setMediumToken(e.target.value)}
                          placeholder="Paste token from Medium: Settings -> Security and apps -> Integration tokens"
                          className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.1] text-xs font-mono text-neutral-200 focus:outline-none focus:border-[#00AB6C]"
                        />
                      </div>

                      <div className="md:col-span-4 space-y-1">
                        <label className="font-mono text-[11px] text-neutral-400">Medium Publish Mode</label>
                        <select
                          value={mediumPublishStatus}
                          onChange={(e) => setMediumPublishStatus(e.target.value as any)}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#0f1117] border border-white/[0.1] text-xs text-neutral-200 focus:outline-none focus:border-[#00AB6C]"
                        >
                          <option value="draft">Draft (Safe: Review on Medium first)</option>
                          <option value="public">Public (Directly Live on Medium)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {saveStatus && (
                  <div
                    className={`p-3 rounded-xl font-mono text-xs ${
                      saveStatus.success
                        ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-300"
                        : "bg-rose-500/10 border border-rose-500/25 text-rose-300"
                    }`}
                  >
                    {saveStatus.success || saveStatus.error}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="px-3 py-1.5 rounded-lg bg-[#0f1117] border border-white/[0.1] text-xs font-mono text-neutral-300"
                  >
                    <option value="published">Status: Published</option>
                    <option value="draft">Status: Draft</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/[0.04] text-neutral-300 text-xs font-medium hover:bg-white/[0.08]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingBlog}
                    className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all"
                  >
                    {savingBlog ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>{editingSlug ? "Save Changes" : "Publish Paper"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Image Insert Modal */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0a0b0e] border border-white/[0.15] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <span className="font-mono text-xs font-semibold text-white">Insert Image Asset</span>
              <button onClick={() => setImageModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] text-neutral-400 mb-1">Upload Local Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full text-xs text-neutral-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-white/[0.06] file:text-neutral-200 hover:file:bg-white/[0.1]"
                />
                {uploadingImage && <p className="text-[10px] font-mono text-cyan-400 mt-1">Uploading...</p>}
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-white/[0.06]"></div>
                <span className="flex-shrink mx-2 text-[10px] font-mono text-neutral-500 uppercase">Or URL</span>
                <div className="flex-grow border-t border-white/[0.06]"></div>
              </div>

              <div>
                <label className="block font-mono text-[11px] text-neutral-400 mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-neutral-400 mb-1">Caption</label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="e.g. Model architecture diagram"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (imageUrl) {
                    insertContent(`![${imageCaption}](${imageUrl})`);
                    setImageModalOpen(false);
                    setImageUrl("");
                    setImageCaption("");
                  }
                }}
                disabled={!imageUrl}
                className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-semibold"
              >
                Insert External Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Video Insert Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0a0b0e] border border-white/[0.15] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <span className="font-mono text-xs font-semibold text-white">Embed Video / Media</span>
              <button onClick={() => setVideoModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] text-neutral-400 mb-1">
                  YouTube / Vimeo / MP4 URL
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://.../video.mp4"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <p className="text-[11px] font-mono text-neutral-400">
                The renderer will automatically embed an interactive responsive video player.
              </p>

              <button
                type="button"
                onClick={() => {
                  if (videoUrl) {
                    insertContent(`[Watch Video](${videoUrl})`);
                    setVideoModalOpen(false);
                    setVideoUrl("");
                  }
                }}
                disabled={!videoUrl}
                className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-semibold"
              >
                Embed Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Code Block Insert Modal */}
      {codeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0a0b0e] border border-white/[0.15] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <span className="font-mono text-xs font-semibold text-white">Insert Code Snippet</span>
              <button onClick={() => setCodeModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] text-neutral-400 mb-1">Language</label>
                <select
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0f1117] border border-white/[0.1] text-xs font-mono text-neutral-200"
                >
                  <option value="python">Python</option>
                  <option value="typescript">TypeScript</option>
                  <option value="sql">SQL</option>
                  <option value="bash">Bash / Shell</option>
                  <option value="json">JSON</option>
                  <option value="dockerfile">Dockerfile</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[11px] text-neutral-400 mb-1">Code</label>
                <textarea
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  rows={6}
                  placeholder="# Paste code snippet here..."
                  className="w-full p-3 rounded-xl bg-[#07080c] border border-white/[0.1] text-xs font-mono text-neutral-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (codeSnippet) {
                    insertContent(`\`\`\`${codeLanguage}\n${codeSnippet}\n\`\`\``);
                    setCodeModalOpen(false);
                    setCodeSnippet("");
                  }
                }}
                disabled={!codeSnippet}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold"
              >
                Insert Code Block
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
