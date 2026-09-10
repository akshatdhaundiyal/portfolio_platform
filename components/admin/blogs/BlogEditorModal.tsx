"use client";

import React, { useState, useEffect } from "react";
import { X, RefreshCw, Send, ImageIcon, Video, Code2, Sparkles, BookOpen } from "lucide-react";
import BlogContentRenderer from "@/components/BlogContentRenderer";
import {
  ImageInsertModal,
  VideoInsertModal,
  CodeInsertModal,
} from "./BlogMediaModals";
import type { BlogListItem } from "./BlogTable";

interface BlogEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any, crossPostToMedium: boolean, mediumToken: string, mediumPublishStatus: "draft" | "public") => Promise<void>;
  editingBlog: BlogListItem | null;
  saving: boolean;
}

export default function BlogEditorModal({
  isOpen,
  onClose,
  onSave,
  editingBlog,
  saving,
}: BlogEditorModalProps) {
  const [formData, setFormData] = useState<Partial<BlogListItem>>({
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
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("split");

  // Media Insertion State
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState("python");
  const [codeSnippet, setCodeSnippet] = useState("");

  // Medium Cross-Posting State
  const [crossPostToMedium, setCrossPostToMedium] = useState(false);
  const [mediumToken, setMediumToken] = useState("");
  const [mediumPublishStatus, setMediumPublishStatus] = useState<"draft" | "public">("draft");

  useEffect(() => {
    if (editingBlog) {
      setFormData({ ...editingBlog });
      setTagsInput(editingBlog.tags?.join(", ") || "");
    } else {
      setFormData({
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
      setTagsInput("Machine Learning, System Design");
    }
  }, [editingBlog, isOpen]);

  if (!isOpen) return null;

  const insertContent = (markdown: string) => {
    setFormData((prev) => ({
      ...prev,
      content: (prev.content || "") + "\n\n" + markdown,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        setImageUrl(data.url);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch {
      alert("Error uploading file");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      alert("Article title is required.");
      return;
    }

    const payload = {
      ...formData,
      slug:
        formData.slug ||
        formData
          .title!.toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-"),
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    await onSave(payload, crossPostToMedium, mediumToken, mediumPublishStatus);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
        <div className="w-full max-w-6xl max-h-[92vh] flex flex-col bg-white dark:bg-[#18191e] border border-[#22211f]/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#22211f]/10 dark:border-white/10 bg-[#f6f4ee]/50 dark:bg-[#121316]/50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d94e34] animate-pulse" />
              <h3 className="font-serif text-lg font-bold text-[#22211f] dark:text-white">
                {editingBlog ? `Edit Paper: ${editingBlog.title}` : "Compose Technical Article"}
              </h3>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border border-[#22211f]/10 dark:border-white/10 p-0.5 bg-[#f6f4ee] dark:bg-[#121316] font-mono text-[11px]">
                {(["edit", "split", "preview"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 rounded-md uppercase tracking-wider font-semibold transition-colors ${
                      viewMode === mode
                        ? "bg-[#d94e34] text-white"
                        : "text-[#22211f]/60 dark:text-white/60 hover:text-[#22211f] dark:hover:text-white"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <button
                onClick={onClose}
                className="p-1 rounded-md text-[#22211f]/40 dark:text-white/40 hover:bg-[#22211f]/5 dark:hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Media Toolbar */}
          <div className="px-6 py-2 border-b border-[#22211f]/5 dark:border-white/5 bg-[#f6f4ee]/30 dark:bg-[#121316]/30 flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="text-[10px] uppercase tracking-wider text-[#22211f]/50 dark:text-white/50 mr-1">
              Insert Media:
            </span>
            <button
              type="button"
              onClick={() => setImageModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#22211f]/10 dark:border-white/10 hover:border-[#d94e34] text-[#22211f]/70 dark:text-white/70"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#d94e34]" />
              <span>Image</span>
            </button>
            <button
              type="button"
              onClick={() => setVideoModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#22211f]/10 dark:border-white/10 hover:border-[#d94e34] text-[#22211f]/70 dark:text-white/70"
            >
              <Video className="w-3.5 h-3.5 text-blue-500" />
              <span>Video Link</span>
            </button>
            <button
              type="button"
              onClick={() => setCodeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#22211f]/10 dark:border-white/10 hover:border-[#d94e34] text-[#22211f]/70 dark:text-white/70"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Code Block</span>
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-serif text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug || ""}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category || "Applied ML"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-mono"
                  >
                    <option value="Applied ML">Applied ML</option>
                    <option value="Enterprise AI">Enterprise AI</option>
                    <option value="NLP & Cloud">NLP & Cloud</option>
                    <option value="Design Systems">Design Systems</option>
                    <option value="Product Strategy">Product Strategy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={formData.readTime || ""}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="6 min read"
                    className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-1">
                    Tags (Comma-Separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Machine Learning, Polars, MLOps"
                    className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#22211f]/60 dark:text-white/60 mb-1">
                  Summary / Abstract
                </label>
                <input
                  type="text"
                  value={formData.summary || ""}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Executive brief of research findings..."
                  className="w-full px-3 py-2 rounded-lg bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-sans text-xs"
                />
              </div>

              {/* Editor Split Canvas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[360px]">
                {(viewMode === "edit" || viewMode === "split") && (
                  <div className={`h-full flex flex-col ${viewMode === "edit" ? "md:col-span-2" : ""}`}>
                    <textarea
                      value={formData.content || ""}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="# Markdown paper content here..."
                      className="w-full h-full p-4 rounded-xl bg-[#f6f4ee] dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 text-[#22211f] dark:text-white font-mono text-xs resize-none focus:outline-hidden focus:border-[#d94e34]"
                    />
                  </div>
                )}

                {(viewMode === "preview" || viewMode === "split") && (
                  <div
                    className={`h-full overflow-y-auto p-5 rounded-xl bg-white dark:bg-[#121316] border border-[#22211f]/10 dark:border-white/10 font-sans ${
                      viewMode === "preview" ? "md:col-span-2" : ""
                    }`}
                  >
                    <BlogContentRenderer content={formData.content || "*No content written yet.*"} />
                  </div>
                )}
              </div>

              {/* Medium Cross-Posting Option */}
              <div className="p-4 rounded-xl bg-[#f6f4ee]/60 dark:bg-[#121316]/60 border border-[#22211f]/10 dark:border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="mediumCrossPost"
                    checked={crossPostToMedium}
                    onChange={(e) => setCrossPostToMedium(e.target.checked)}
                    className="rounded border-[#22211f]/30"
                  />
                  <label htmlFor="mediumCrossPost" className="font-mono text-xs text-[#22211f] dark:text-white cursor-pointer flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#d94e34]" />
                    <span>Cross-post to Medium simultaneously (SEO canonical preserved)</span>
                  </label>
                </div>

                {crossPostToMedium && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <input
                      type="password"
                      placeholder="Medium Integration Token"
                      value={mediumToken}
                      onChange={(e) => setMediumToken(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#18191e] border border-[#22211f]/10 dark:border-white/10 text-xs font-mono text-[#22211f] dark:text-white"
                    />
                    <select
                      value={mediumPublishStatus}
                      onChange={(e) => setMediumPublishStatus(e.target.value as any)}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#18191e] border border-[#22211f]/10 dark:border-white/10 text-xs font-mono text-[#22211f] dark:text-white"
                    >
                      <option value="draft">Publish as Draft on Medium</option>
                      <option value="public">Publish as Public on Medium</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#22211f]/10 dark:border-white/10 bg-[#f6f4ee]/50 dark:bg-[#121316]/50">
              <span className="text-[11px] font-mono text-[#22211f]/40 dark:text-white/40">
                Markdown & LaTeX mathematical formulas supported
              </span>

              <div className="flex items-center gap-3">
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
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold bg-[#d94e34] hover:bg-[#c23d24] text-white shadow-xs disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{editingBlog ? "Save Changes" : "Publish Article"}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Media Modals */}
      <ImageInsertModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        imageCaption={imageCaption}
        setImageCaption={setImageCaption}
        uploadingImage={uploadingImage}
        onUpload={handleImageUpload}
        onInsert={() => {
          if (imageUrl) {
            insertContent(`![${imageCaption || "Image"}](${imageUrl})`);
            setImageUrl("");
            setImageCaption("");
            setImageModalOpen(false);
          }
        }}
      />

      <VideoInsertModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
        onInsert={() => {
          if (videoUrl) {
            insertContent(`[Watch Video](${videoUrl})`);
            setVideoUrl("");
            setVideoModalOpen(false);
          }
        }}
      />

      <CodeInsertModal
        isOpen={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
        codeLanguage={codeLanguage}
        setCodeLanguage={setCodeLanguage}
        codeSnippet={codeSnippet}
        setCodeSnippet={setCodeSnippet}
        onInsert={() => {
          if (codeSnippet) {
            insertContent(`\`\`\`${codeLanguage}\n${codeSnippet}\n\`\`\``);
            setCodeSnippet("");
            setCodeModalOpen(false);
          }
        }}
      />
    </>
  );
}
