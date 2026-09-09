"use client";

import React, { useState } from "react";
import { StrategicCaseStudy } from "@/lib/data/projects";
import { ArrowUpRight, ChevronDown, ChevronUp, Cpu, Lightbulb, Scale, Sparkles, TrendingUp } from "lucide-react";

interface Props {
  caseStudy: StrategicCaseStudy;
}

export default function TicketCaseStudy({ caseStudy }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative max-w-5xl mx-auto my-12 group">
      {/* Tape strip at corner */}
      <div className="washi-tape -top-3 left-10 rotate-[-3deg]" />

      {/* The Physical Perforated Boarding Pass Ticket */}
      <div className="relative bg-[#f4ede2] text-[#18181b] rounded-xl shadow-2xl border border-black/20 overflow-hidden flex flex-col md:flex-row transition-transform duration-300 hover:rotate-[-0.25deg]">
        
        {/* Semicircular Notches for Ticket Tear Line */}
        <div className="hidden md:block absolute top-[50%] -translate-y-1/2 right-[255px] z-20">
          <div className="w-6 h-6 rounded-full bg-[#121316] -mt-3" />
        </div>

        {/* ----------------- LEFT MAIN TICKET BODY ----------------- */}
        <div className="flex-1 p-6 sm:p-10 space-y-6">
          
          {/* Ticket Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
            <div className="font-mono text-xs text-neutral-600 flex items-center gap-2">
              <span className="font-bold tracking-widest text-black">PASS NO. 8821-GLM</span>
              <span>•</span>
              <span>{caseStudy.organization} ({caseStudy.period})</span>
            </div>

            {/* Red Rubber Ink Stamp (Jackie Zhang signature) */}
            <div className="rubber-stamp text-[#d94e34] border-[#d94e34] text-xs">
              <span>★ APPROVED AUDIT // +$12M RECOVERED</span>
            </div>
          </div>

          {/* Ticket Title */}
          <div className="space-y-1">
            <h2 className="font-serif text-2xl sm:text-4xl text-neutral-900 tracking-tight leading-tight">
              {caseStudy.title}
            </h2>
            <p className="font-mono text-xs sm:text-sm font-semibold text-indigo-900">
              {caseStudy.subtitle}
            </p>
          </div>

          {/* 1. Opportunity & Context */}
          <div className="space-y-1 text-xs sm:text-sm text-neutral-800">
            <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 font-bold block">
              Context & Opportunity:
            </span>
            <p className="leading-relaxed font-sans">
              {caseStudy.context}
            </p>
          </div>

          {/* 2. Technical & Mathematical Formulation */}
          <div className="space-y-2 text-xs sm:text-sm text-neutral-800">
            <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 font-bold block">
              Architectural Execution:
            </span>
            <ul className="space-y-1.5 font-sans">
              {caseStudy.execution.architecture.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#d94e34] font-mono font-bold">↳</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Expandable Trade-offs */}
          {expanded && (
            <div className="space-y-3 pt-3 border-t border-black/10 animate-in fade-in">
              <span className="font-mono text-[11px] uppercase tracking-wider text-amber-800 font-bold block">
                Key Engineering & Unit Economic Trade-offs:
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

          {/* Signature Jackie Zhang Post-It Note ("Learnt that...") */}
          <div className="learnt-sticky-note p-4 mt-4">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-amber-800 uppercase tracking-wider pb-1">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Retrospective // Learnt that...</span>
            </div>
            <p className="font-serif italic text-xs sm:text-sm text-neutral-900 leading-relaxed">
              &ldquo;{caseStudy.learntThat}&rdquo;
            </p>
          </div>

          {/* Ticket Footer Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-black/10 font-mono text-xs">
            <div className="flex flex-wrap gap-1.5">
              {caseStudy.execution.techStack.map((tech) => (
                <span key={tech} className="px-2 py-0.5 rounded bg-black/5 border border-black/10 text-[11px] text-neutral-800">
                  {tech}
                </span>
              ))}
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="font-mono text-xs text-neutral-600 hover:text-black font-semibold underline flex items-center gap-1"
            >
              <span>{expanded ? "Collapse Trade-offs" : "View Trade-offs"}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>

        {/* ----------------- RIGHT TEAR-OFF RECEIPT STUB ----------------- */}
        <div className="w-full md:w-64 bg-[#ece3d4] border-t md:border-t-0 md:border-l border-dashed border-neutral-400 p-6 flex flex-col justify-between space-y-6 font-mono text-xs">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-[11px] text-neutral-500 border-b border-black/10 pb-2">
              <span>AUDIT STUB</span>
              <span>NO. 8821</span>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase">Policy Target</span>
                <span className="font-bold text-neutral-900">Commercial P&C</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase">Audit Classification</span>
                <span className="font-bold text-neutral-900">Tier-1 Field Dispatch</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase">Revenue Lift</span>
                <span className="font-bold text-emerald-800 text-sm">+$12,000,000</span>
              </div>
            </div>
          </div>

          {/* Barcode Metaphor */}
          <div className="pt-4 border-t border-black/10 space-y-2 text-center">
            <div className="font-mono text-2xl tracking-[0.25em] text-neutral-800 font-bold select-none overflow-hidden">
              ||||| | ||| |||| | |||||
            </div>
            <div className="text-[9px] text-neutral-500 tracking-wider">
              ACTUARIAL-GLM-EAV-VERIFIED
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
