"use client";

import React, { useState } from "react";
import { StrategicCaseStudy } from "@/lib/data/projects";
import { ArrowUpRight, ChevronDown, ChevronUp, Cpu, Lightbulb, Scale, Sparkles, TrendingUp } from "lucide-react";

interface Props {
  caseStudy: StrategicCaseStudy;
  index: number;
}

export default function CaseStudyCard({ caseStudy, index }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="artifact-card rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden group">
      {/* Top Header Row: Category Tag, Organization, & Metric Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 dark:border-white/[0.08] pb-5">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-neutral-500 dark:text-neutral-400">
          <span className="px-2.5 py-1 rounded bg-black/[0.04] dark:bg-white/[0.04] border border-black/10 dark:border-white/[0.08] text-neutral-700 dark:text-neutral-200">
            0{index + 1} // {caseStudy.category}
          </span>
          {caseStudy.organization && (
            <span className="text-neutral-500 dark:text-neutral-400">@ {caseStudy.organization}</span>
          )}
          <span className="text-neutral-400 dark:text-neutral-500">• {caseStudy.period}</span>
        </div>

        {/* High-Contrast Prominent Metric Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 shadow-sm">
          <TrendingUp className="w-4 h-4" />
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="font-bold text-base tracking-tight">{caseStudy.metricBadge.value}</span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-300/80 font-sans">{caseStudy.metricBadge.label}</span>
          </div>
        </div>
      </div>

      {/* Main Titles */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-white tracking-tight group-hover:text-[#d94e34] dark:group-hover:text-cyan-300 transition-colors">
            {caseStudy.title}
          </h3>
          {caseStudy.githubUrl && (
            <a
              href={caseStudy.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors p-1"
              title="View Repository"
            >
              <ArrowUpRight className="w-5 h-5" />
            </a>
          )}
        </div>
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300/90 font-mono">
          {caseStudy.subtitle}
        </p>
      </div>

      {/* 1. Context & Opportunity */}
      <div className="space-y-2 text-sm">
        <div className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          <span>Context & Opportunity</span>
        </div>
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {caseStudy.context}
        </p>
      </div>

      {/* 2. Technical & Product Execution */}
      <div className="space-y-3 text-sm">
        <div className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>Technical & Product Execution</span>
        </div>
        <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
          {caseStudy.execution.architecture.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-cyan-600 dark:text-cyan-400 font-mono text-xs mt-1">↳</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Expandable Deep Dive: Key Trade-offs */}
      {expanded && (
        <div className="space-y-4 pt-2 border-t border-black/10 dark:border-white/[0.06] animate-in fade-in duration-200">
          <div className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Key Engineering & Product Trade-offs</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caseStudy.tradeoffs.map((t, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/[0.06] space-y-1.5"
              >
                <div className="font-mono text-xs font-medium text-amber-700 dark:text-amber-300">
                  {t.tension}
                </div>
                <div className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {t.resolution}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Signature Jackie Zhang "Learnt that..." Callout */}
      <div className="learnt-callout">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-mono text-xs font-semibold uppercase tracking-wider pb-1">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Learnt that...</span>
        </div>
        <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed italic">
          &ldquo;{caseStudy.learntThat}&rdquo;
        </p>
      </div>

      {/* Card Footer: Tech Stack Tags & Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-black/10 dark:border-white/[0.08]">
        <div className="flex flex-wrap gap-1.5">
          {caseStudy.execution.techStack.map((tech) => (
            <span key={tech} className="tech-tag">
              {tech}
            </span>
          ))}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1 text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <span>{expanded ? "Collapse Trade-offs" : "View Trade-offs"}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>
    </article>
  );
}
