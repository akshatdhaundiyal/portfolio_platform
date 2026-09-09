"use client";

import React, { useState } from "react";
import { StrategicCaseStudy } from "@/lib/data/projects";
import { ArrowUpRight, ChevronDown, ChevronUp, Cpu, Lightbulb, Scale, Sparkles, Zap } from "lucide-react";

interface Props {
  caseStudy: StrategicCaseStudy;
}

export default function BaggageTagCaseStudy({ caseStudy }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative max-w-5xl mx-auto my-16 group">
      
      {/* Realistic Hanging String Loop Metaphor */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-4 h-14 border-2 border-[#b8a994] rounded-t-full shadow-sm pointer-events-none z-10" />

      {/* The Physical Baggage / Hardware Tag (Chipped Corners & Eyelet) */}
      <div className="relative bg-[#f1ebe1] text-[#1c1917] rounded-xl shadow-2xl border border-black/20 p-6 sm:p-12 overflow-hidden transition-transform duration-300 hover:rotate-[0.35deg]">
        
        {/* Metal Grommet Eyelet at Top Center */}
        <div className="flex justify-center -mt-2 pb-6">
          <div className="metal-eyelet flex items-center justify-center" />
        </div>

        {/* Top Tag Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-5">
          <div className="font-mono text-xs text-neutral-600 flex items-center gap-2">
            <span className="font-bold tracking-widest text-black">TAG NO. VTX-702-NLP</span>
            <span>•</span>
            <span>Google Vertex AI Pipeline</span>
          </div>

          {/* Rubber Stamp: Passed SLA */}
          <div className="rubber-stamp text-emerald-800 border-emerald-800 text-xs">
            <Zap className="w-3.5 h-3.5 inline mr-1" />
            <span>PASSED SLA // 70% FASTER (&lt;85ms)</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1.5 pt-4">
          <h2 className="font-serif text-2xl sm:text-4xl text-neutral-900 tracking-tight leading-tight">
            {caseStudy.title}
          </h2>
          <p className="font-mono text-xs sm:text-sm font-semibold text-cyan-900">
            {caseStudy.subtitle}
          </p>
        </div>

        {/* 1. Opportunity */}
        <div className="space-y-1 text-xs sm:text-sm text-neutral-800 pt-4">
          <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 font-bold block">
            The Business Problem:
          </span>
          <p className="leading-relaxed font-sans">
            {caseStudy.context}
          </p>
        </div>

        {/* 2. Technical & Pipeline Execution */}
        <div className="space-y-2 text-xs sm:text-sm text-neutral-800 pt-4">
          <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 font-bold block">
            Transformer Inference Pipeline:
          </span>
          <ul className="space-y-1.5 font-sans">
            {caseStudy.execution.architecture.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-cyan-800 font-mono font-bold">↳</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expandable Trade-offs */}
        {expanded && (
          <div className="space-y-3 pt-4 border-t border-black/10 animate-in fade-in">
            <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-600 font-bold block">
              Inference Latency vs. Model Quantization Trade-offs:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {caseStudy.tradeoffs.map((t, idx) => (
                <div key={idx} className="p-3 bg-black/5 rounded-md border border-black/10 text-xs font-mono">
                  <div className="font-bold text-neutral-900 mb-1">{t.tension}</div>
                  <div className="text-neutral-700 leading-relaxed font-sans">{t.resolution}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jackie Zhang Signature Sticky Note */}
        <div className="learnt-sticky-note p-4 mt-6">
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-amber-800 uppercase tracking-wider pb-1">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Retrospective // Learnt that...</span>
          </div>
          <p className="font-serif italic text-xs sm:text-sm text-neutral-900 leading-relaxed">
            &ldquo;{caseStudy.learntThat}&rdquo;
          </p>
        </div>

        {/* Bottom Tag Barcode & Footer */}
        <div className="mt-6 pt-5 border-t border-black/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex flex-wrap gap-1.5">
            {caseStudy.execution.techStack.map((tech) => (
              <span key={tech} className="px-2 py-0.5 rounded bg-black/5 border border-black/10 text-[11px] text-neutral-800">
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="font-mono text-xs text-neutral-600 hover:text-black font-semibold underline flex items-center gap-1"
            >
              <span>{expanded ? "Collapse Trade-offs" : "View Trade-offs"}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <span className="font-mono text-xs text-neutral-400 tracking-widest hidden sm:inline">
              |||| || ||| |||||
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
