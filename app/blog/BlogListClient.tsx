"use client";

import React, { useState, useMemo } from "react";
import BlogCard from "@/components/BlogCard";
import { BlogPost } from "@/lib/blogs";
import { Search, X } from "lucide-react";

interface Props {
  initialBlogs: BlogPost[];
}

const categories = ["All Articles", "Enterprise AI", "Applied ML", "NLP & Cloud", "Design Systems"];

export default function BlogListClient({ initialBlogs }: Props) {
  const [activeCategory, setActiveCategory] = useState("All Articles");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBlogs = useMemo(() => {
    return initialBlogs.filter((post) => {
      const matchesCategory =
        activeCategory === "All Articles" || post.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        post.title.toLowerCase().includes(q) ||
        (post.subtitle && post.subtitle.toLowerCase().includes(q)) ||
        post.summary.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [initialBlogs, activeCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
                activeCategory === cat
                  ? "bg-neutral-900 dark:bg-white/[0.12] text-white border border-neutral-900 dark:border-white/20 font-semibold shadow-sm"
                  : "bg-black/[0.04] dark:bg-white/[0.02] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.08] dark:hover:bg-white/[0.05] border border-black/10 dark:border-white/[0.06]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papers, tech, or tags..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/[0.1] text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500/60 focus:bg-white dark:focus:bg-white/[0.05] transition-all"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Blog Cards Grid */}
      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog.slug} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 artifact-card rounded-2xl space-y-3 font-mono text-xs text-neutral-600 dark:text-neutral-400">
          <p>No papers matching query &ldquo;{searchQuery}&rdquo;</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("All Articles");
            }}
            className="text-cyan-700 dark:text-cyan-400 underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
