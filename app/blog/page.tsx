import React from "react";
import { getAllBlogs } from "@/lib/blogs";
import BlogListClient from "./BlogListClient";
import { BookOpen } from "lucide-react";

export const metadata = {
  title: "Technical Writing & System Papers | Akshat Dhaundiyal",
  description:
    "Technical articles and system papers by Akshat Dhaundiyal on Machine Learning, Actuarial GLMs, Google Vertex AI, and high-contrast architecture.",
};

export default async function BlogPage() {
  const blogs = await getAllBlogs({ status: "published" });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header Banner */}
      <div className="space-y-4 border-b border-black/10 dark:border-white/[0.08] pb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-400 font-mono text-xs">
          <BookOpen className="w-3.5 h-3.5" />
          <span>PUBLIC DISPATCHES // TECHNICAL WRITING & SYSTEMS</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          Thoughts & System Papers.
        </h1>

        <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 max-w-2xl leading-relaxed">
          Deep-dives into actuarial mathematical modeling, high-throughput cloud ML inference pipelines, on-device edge intelligence, and functional design principles.
        </p>
      </div>

      {/* Interactive Blog List with Search & Category Filters */}
      <BlogListClient initialBlogs={blogs} />
    </div>
  );
}
