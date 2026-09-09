"use client";

import React from "react";
import { sideQuests } from "@/lib/data/projects";
import { ArrowUpRight, BookOpen, Code2, Cpu, Wrench } from "lucide-react";

export default function SideQuestGrid() {
  return (
    <section className="relative max-w-5xl mx-auto my-16">
      
      {/* Top Tape Accent */}
      <div className="washi-tape -top-3 right-16 rotate-[-2deg]" />

      {/* Wire Coil Spiral Binding Header (Jackie Zhang signature) */}
      <div className="relative z-20 flex justify-center gap-3 sm:gap-6 -mb-3 px-8">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            {/* Wire Loop */}
            <div className="w-2.5 h-7 rounded-full bg-gradient-to-r from-neutral-400 via-neutral-200 to-neutral-500 shadow-md border border-black/30" />
            {/* Punched Paper Hole */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#121316] -mt-1 shadow-inner" />
          </div>
        ))}
      </div>

      {/* The Physical Spiral Sketchbook Sheet */}
      <div className="relative bg-[#f6f1e8] text-[#1a1a1c] rounded-xl shadow-2xl border border-black/15 p-6 sm:p-12 overflow-hidden">
        
        {/* Sketchbook Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/10 pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#d94e34] font-bold pb-1">
              <BookOpen className="w-4 h-4" />
              <span>SKETCHBOOK // VOLUME 02</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 tracking-tight">
              Side Quests & AI Prototypes
            </h2>
          </div>
          <p className="font-mono text-xs text-neutral-600">
            Hardware hacks, real-time IoT appliances, & open tools
          </p>
        </div>

        {/* The Grid of Engineering Artifacts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sideQuests.map((quest) => (
            <div
              key={quest.id}
              className="bg-white/80 hover:bg-white rounded-lg p-5 border border-black/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                {/* Header: Category & Metric */}
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-black/5 text-neutral-700 font-semibold">
                    {quest.category}
                  </span>
                  {quest.latencyOrMetric && (
                    <span className="text-emerald-800 font-bold">
                      {quest.latencyOrMetric}
                    </span>
                  )}
                </div>

                {/* Title & Link */}
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-serif text-lg font-semibold text-neutral-900 group-hover:text-[#d94e34] transition-colors">
                    {quest.title}
                  </h3>
                  <a
                    href={quest.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-500 hover:text-black transition-colors p-1"
                    title="View GitHub Repository"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-700 leading-relaxed font-sans">
                  {quest.oneLiner}
                </p>
              </div>

              {/* Stack Badges */}
              <div className="pt-2 border-t border-black/10 flex flex-wrap gap-1.5 font-mono text-[10px]">
                {quest.stack.map((item) => (
                  <span key={item} className="px-2 py-0.5 rounded bg-black/5 text-neutral-800">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
