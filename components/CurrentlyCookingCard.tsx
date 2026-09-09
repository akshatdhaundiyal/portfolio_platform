"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Terminal, Github, ArrowUpRight, Cpu } from "lucide-react";
import type { ProjectItem } from "@/lib/data/projects";

interface CurrentlyCookingCardProps {
  project?: ProjectItem;
}

export default function CurrentlyCookingCard({ project }: CurrentlyCookingCardProps) {
  if (!project) return null;

  const wipNote =
    project.artifactMetadata?.wipNote ||
    "Currently refining int8 ONNX quantization & testing v0.4 release on macOS/Linux.";

  return (
    <section className="relative w-full max-w-4xl mx-auto my-14">
      {/* Editorial Section Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2.5">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Currently cooking <span className="font-sans text-[#d94e34]">☺︎</span>
          </h2>
        </div>

        {/* Live Active Pulse Pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
          <span className="font-medium">Active Build • v0.4</span>
        </div>
      </div>

      {/* Main Interactive Card */}
      <div className="relative rounded-2xl bg-white dark:bg-[#18191e] border border-black/10 dark:border-white/[0.08] shadow-xl dark:shadow-2xl overflow-hidden group hover:border-black/20 dark:hover:border-white/20 transition-all">
        {/* Subtle top accent gradient */}
        <div className="h-1 w-full bg-gradient-to-r from-[#d94e34] via-amber-500 to-emerald-400" />

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-[#d94e34] font-semibold">
                {project.category} // {project.period}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
                {project.title}
              </h3>
              {project.subtitle && (
                <p className="font-serif italic text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  {project.subtitle}
                </p>
              )}
            </div>

            {/* Latency / SLA Box */}
            <div className="sm:text-right bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/[0.08] p-3 rounded-lg flex sm:flex-col items-center sm:items-end justify-between gap-2">
              <span className="font-mono text-[10px] uppercase text-neutral-500 dark:text-neutral-400 tracking-wider">
                Inference Target
              </span>
              <span className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {project.metricValue}
              </span>
              <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                {project.metricLabel}
              </span>
            </div>
          </div>

          {/* Narrative Summary */}
          <div className="text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed font-sans space-y-3">
            <p>
              Designing and training a local-first desktop memory intelligence application. Instead of paying recurring monthly subscription fees and uploading personal family photos to third-party corporate servers,{" "}
              <strong className="text-neutral-900 dark:text-white font-semibold">Media Chronicle</strong> executes neural face recognition and semantic embedding search directly on consumer CPU/GPU hardware.
            </p>
          </div>

          {/* Active Work In Progress Callout */}
          <div className="bg-[#f9f7f2] dark:bg-[#121316] rounded-xl border border-black/10 dark:border-white/[0.06] p-4 flex items-start gap-3 text-xs font-mono text-neutral-800 dark:text-neutral-300">
            <div className="p-2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-amber-700 dark:text-amber-400 font-bold block mb-0.5">
                Current Sprint Focus:
              </span>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans text-xs">
                {wipNote}
              </p>
            </div>
          </div>

          {/* Tech Stack Pills & Links */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/[0.06]">
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] font-mono text-xs text-neutral-300"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-mono font-medium text-white transition-all"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Alpha</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
