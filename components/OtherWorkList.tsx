"use client";

import React, { useState } from "react";
import { Github, ArrowUpRight, ChevronRight, Layers } from "lucide-react";
import type { ProjectItem } from "@/lib/data/projects";

interface OtherWorkListProps {
  projects: ProjectItem[];
}

export default function OtherWorkList({ projects }: OtherWorkListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="relative w-full max-w-4xl mx-auto my-14">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-2.5">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Other Work <span className="text-[#d94e34]">⁕</span>
          </h2>
        </div>
        <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
          Exploratory Systems & IoT
        </span>
      </div>

      {/* Clean Editorial List */}
      <div className="space-y-3">
        {projects.map((item) => {
          const isHovered = hoveredId === item.id;
          return (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative rounded-xl border border-black/10 dark:border-white/[0.08] bg-white/90 dark:bg-[#16171c]/90 hover:bg-white dark:hover:bg-[#1a1c22] p-5 sm:p-6 transition-all duration-200 group shadow-sm dark:shadow-none"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white group-hover:text-[#d94e34] transition-colors">
                      {item.title}
                    </h3>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/5 dark:bg-white/[0.05] text-neutral-600 dark:text-neutral-400 border border-black/10 dark:border-white/[0.06]">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-sm text-neutral-700 dark:text-neutral-300 font-sans leading-relaxed">
                    {item.summary || item.subtitle}
                  </p>

                  {/* Tech stack pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    {item.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/[0.03] text-neutral-700 dark:text-neutral-400 font-mono text-[10px] border border-black/10 dark:border-white/[0.06]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Side: Metric & Repo Link */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0">
                  {item.metricValue && (
                    <div className="sm:text-right">
                      <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 block">
                        {item.metricValue}
                      </span>
                      {item.metricLabel && (
                        <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 block">
                          {item.metricLabel}
                        </span>
                      )}
                    </div>
                  )}

                  {item.githubUrl && (
                    <a
                      href={item.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/[0.04] dark:bg-white/[0.04] hover:bg-[#d94e34] dark:hover:bg-[#d94e34] text-neutral-700 dark:text-neutral-300 hover:text-white dark:hover:text-white font-mono text-xs border border-black/10 dark:border-white/[0.08] transition-all"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
