"use client";

import React from "react";
import Link from "next/link";
import { BlogPost } from "@/lib/blogs";
import { ArrowUpRight, Clock, Tag } from "lucide-react";

interface Props {
  blog: BlogPost;
}

export default function BlogCard({ blog }: Props) {
  return (
    <article className="artifact-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5 hover:border-indigo-500/30 transition-all group">
      <div className="space-y-3">
        {/* Top Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
          <span className="px-2.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-indigo-300">
            {blog.category}
          </span>
          <div className="flex items-center gap-2 text-neutral-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{blog.readTime}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/blog/${blog.slug}`} className="block">
          <h3 className="text-xl font-semibold text-white tracking-tight group-hover:text-cyan-300 transition-colors leading-snug">
            {blog.title}
          </h3>
        </Link>

        {/* Subtitle / Summary */}
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-3">
          {blog.summary}
        </p>
      </div>

      {/* Footer: Tags & Read Link */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap gap-1.5 font-mono text-[11px] text-neutral-400">
          {blog.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tech-tag text-[10px]">
              #{tag}
            </span>
          ))}
        </div>

        <Link
          href={`/blog/${blog.slug}`}
          className="inline-flex items-center gap-1 font-mono text-xs text-neutral-400 group-hover:text-white transition-colors"
        >
          <span>Read Paper</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
