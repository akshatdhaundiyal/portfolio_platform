"use client";

import React, { useState } from "react";
import { StrategicCaseStudy } from "@/lib/data/projects";
import { ArrowUpRight, ChevronDown, ChevronUp, Cpu, Lightbulb, Power, Terminal, Video } from "lucide-react";

interface Props {
  caseStudy: StrategicCaseStudy;
}

export default function RetroCrtCaseStudy({ caseStudy }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative max-w-5xl mx-auto my-16 group">
      
      {/* Outer Molded Retro CRT Chassis Metaphor */}
      <div className="crt-bezel p-6 sm:p-10 text-neutral-200">
        
        {/* CRT Top Control Strip: Speaker Grille & Power LED */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="text-neutral-400 font-bold uppercase tracking-wider">
              ON-DEVICE NEURAL TERMINAL // MODEL 2024
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Speaker ventilation grille dots */}
            <div className="hidden sm:flex gap-1.5 opacity-40">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            </div>

            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-mono">
              <Power className="w-3.5 h-3.5" />
              <span>ONLINE</span>
            </div>
          </div>
        </div>

        {/* Inner Curved CRT Display Screen */}
        <div className="crt-screen p-6 sm:p-8 mt-6 space-y-6">
          
          {/* Header Metric Pill */}
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs border-b border-white/10 pb-4">
            <div className="text-emerald-400 flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span className="font-bold">{caseStudy.metricBadge.value}</span>
              <span className="text-neutral-400">({caseStudy.metricBadge.label})</span>
            </div>

            <span className="text-xs px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
              100% PRIVATE · ZERO CLOUD FEES
            </span>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1.5">
            <h2 className="font-serif text-2xl sm:text-4xl text-white tracking-tight leading-tight">
              {caseStudy.title}
            </h2>
            <p className="font-mono text-xs sm:text-sm text-emerald-300">
              {caseStudy.subtitle}
            </p>
          </div>

          {/* 1. Opportunity */}
          <div className="space-y-1 text-xs sm:text-sm text-neutral-300">
            <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-400/90 font-bold block">
              &gt; Context & Problem:
            </span>
            <p className="leading-relaxed font-sans">
              {caseStudy.context}
            </p>
          </div>

          {/* 2. On-Device Architecture */}
          <div className="space-y-2 text-xs sm:text-sm text-neutral-300">
            <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-400/90 font-bold block">
              &gt; Embedded Pipeline Architecture:
            </span>
            <ul className="space-y-1.5 font-sans">
              {caseStudy.execution.architecture.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-mono">▸</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Expandable Trade-offs */}
          {expanded && (
            <div className="space-y-3 pt-4 border-t border-white/10 animate-in fade-in">
              <span className="font-mono text-[11px] uppercase tracking-wider text-amber-300 font-bold block">
                &gt; Local Hardware & Storage Trade-offs:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {caseStudy.tradeoffs.map((t, idx) => (
                  <div key={idx} className="p-3 bg-white/5 rounded-md border border-white/10 text-xs font-mono">
                    <div className="font-bold text-amber-200 mb-1">{t.tension}</div>
                    <div className="text-neutral-300 leading-relaxed font-sans">{t.resolution}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Jackie Zhang Retrospective Note */}
          <div className="learnt-sticky-note p-4 text-neutral-950">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-amber-900 uppercase tracking-wider pb-1">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Retrospective // Learnt that...</span>
            </div>
            <p className="font-serif italic text-xs sm:text-sm text-neutral-900 leading-relaxed">
              &ldquo;{caseStudy.learntThat}&rdquo;
            </p>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex flex-wrap gap-1.5">
              {caseStudy.execution.techStack.map((tech) => (
                <span key={tech} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] text-neutral-300">
                  {tech}
                </span>
              ))}
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="text-emerald-400 hover:text-emerald-300 font-semibold underline flex items-center gap-1"
            >
              <span>{expanded ? "Collapse Trade-offs" : "View Trade-offs"}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
