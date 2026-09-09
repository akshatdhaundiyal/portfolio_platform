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
                  ? "bg-white/[0.12] text-white border border-white/20 font-semibold shadow-sm"
                  : "bg-white/[0.02] text-neutral-400 hover:text-white hover:bg-white/[0.05] border border-white/[0.06]"
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
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/[0.03] border border-white/[0.1] text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.05] transition-all"
          >
          </input>
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-white"
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
        <div className="text-center py-16 artifact-card rounded-2xl space-y-3 font-mono text-xs text-neutral-400">
          <p>No papers matching query &ldquo;{searchQuery}&rdquo;</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("All Articles");
            }}
            className="text-cyan-400 underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
