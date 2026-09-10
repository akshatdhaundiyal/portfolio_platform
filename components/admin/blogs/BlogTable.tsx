"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Edit2, Trash2, BookOpen, Send, Sparkles } from "lucide-react";

export interface BlogListItem {
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
  status: "published" | "draft";
  coverImage?: string;
  mediumUrl?: string | null;
}

interface BlogTableProps {
  blogs: BlogListItem[];
  loading: boolean;
  isReadOnly: boolean;
  onEdit: (blog: BlogListItem) => void;
  onDelete: (slug: string) => void;
  onSyndicateMedium: (blog: BlogListItem) => void;
}

export default function BlogTable({
  blogs,
  loading,
  isReadOnly,
  onEdit,
  onDelete,
  onSyndicateMedium,
}: BlogTableProps) {
  if (loading) {
    return (
      <div className="p-16 text-center text-xs font-mono text-[#22211f]/40 dark:text-white/40">
        Loading articles directory...
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#18191e] border border-dashed border-[#22211f]/15 dark:border-white/15 text-xs font-mono text-[#22211f]/50 dark:text-white/50">
        No articles found. Click "Write New Article" to compose your first paper.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#18191e] border border-[#22211f]/10 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#22211f]/10 dark:border-white/10 bg-[#f6f4ee]/50 dark:bg-[#121316]/50 text-[#22211f]/60 dark:text-white/60 font-mono uppercase tracking-wider">
              <th className="py-3 px-5">Article & Synopsis</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Read Time</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4">Syndication</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#22211f]/5 dark:divide-white/5 font-sans">
            {blogs.map((b) => (
              <tr key={b.slug} className="hover:bg-[#22211f]/2 dark:hover:bg-white/2 transition-colors">
                <td className="py-4 px-5">
                  <div className="font-serif font-bold text-sm text-[#22211f] dark:text-white">
                    {b.title}
                  </div>
                  {b.subtitle && (
                    <div className="text-[11px] text-[#22211f]/60 dark:text-white/60 italic mt-0.5 line-clamp-1">
                      {b.subtitle}
                    </div>
                  )}
                  <div className="font-mono text-[10px] text-[#22211f]/40 dark:text-white/40 mt-1">
                    slug: /{b.slug}
                  </div>
                </td>

                <td className="py-4 px-4 font-mono text-[11px] text-[#22211f]/70 dark:text-white/70">
                  <span className="px-2 py-0.5 rounded-full bg-[#22211f]/5 dark:bg-white/10 border border-[#22211f]/10 dark:border-white/10">
                    {b.category}
                  </span>
                </td>

                <td className="py-4 px-4 font-mono text-[11px] text-[#22211f]/60 dark:text-white/60 whitespace-nowrap">
                  {b.readTime || "5 min read"}
                </td>

                <td className="py-4 px-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                      b.status === "published"
                        ? "bg-[#27ae60]/10 text-[#27ae60] border border-[#27ae60]/20"
                        : "bg-[#e67e22]/10 text-[#e67e22] border border-[#e67e22]/20"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>

                <td className="py-4 px-4 font-mono text-[11px]">
                  {b.mediumUrl ? (
                    <a
                      href={b.mediumUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#d94e34] dark:text-[#f87171] hover:underline"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Live on Medium</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ) : !isReadOnly ? (
                    <button
                      onClick={() => onSyndicateMedium(b)}
                      className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#22211f]/50 dark:text-white/50 hover:text-[#d94e34] transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Syndicate</span>
                    </button>
                  ) : (
                    <span className="text-[#22211f]/40 dark:text-white/40">—</span>
                  )}
                </td>

                <td className="py-4 px-5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/blogs/${b.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-[#22211f]/40 dark:text-white/40 hover:text-[#22211f] dark:hover:text-white hover:bg-[#22211f]/5 dark:hover:bg-white/5 transition-colors"
                      title="Preview public paper"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    {!isReadOnly && (
                      <>
                        <button
                          onClick={() => onEdit(b)}
                          className="p-1.5 rounded-lg text-[#22211f]/60 dark:text-white/60 hover:text-[#d94e34] hover:bg-[#d94e34]/10 transition-colors"
                          title="Edit Paper"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(b.slug)}
                          className="p-1.5 rounded-lg text-[#22211f]/40 dark:text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Delete Paper"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
