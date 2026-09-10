"use client";

import React, { useState } from "react";
import { Terminal, Github, Power } from "lucide-react";
import type { ProjectItem } from "@/lib/data/projects";

export default function RetroCrtSkin({ project }: { project: ProjectItem }) {
  const [powerOn, setPowerOn] = useState(true);
  const terminalText = project.artifactMetadata?.terminalText || "LOCAL INFERENCE // ACTIVE [YOLOv8]";

  return (
    <article className="relative w-full max-w-4xl mx-auto my-12 group">
      {/* CRT Chassis Shell */}
      <div className="crt-bezel p-6 sm:p-8 rounded-2xl relative shadow-2xl">
        {/* Top Bezel: Brand Badge & Speaker Grille Dots */}
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-neutral-400 tracking-widest uppercase">
              CHRONICLE DISPLAY UNIT // MODEL 2024
            </span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>

          {/* Speaker Grille Dots */}
          <div className="flex items-center gap-1.5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-neutral-800 shadow-inner" />
            ))}
          </div>
        </div>

        {/* Phosphor CRT Screen */}
        <div
          className={`crt-screen p-5 sm:p-7 transition-all duration-300 relative overflow-hidden ${
            powerOn ? "opacity-100" : "opacity-20"
          }`}
        >
          {/* Subtle CRT Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40 z-10" />

          {/* Screen Content */}
          <div className="relative z-20 space-y-4">
            {/* Terminal Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900/50 pb-2.5 font-mono text-xs text-emerald-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">{terminalText}</span>
              </div>
              <span className="text-[11px] text-neutral-400">{project.period}</span>
            </div>

            {/* Title & Role */}
            <div>
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                {project.role}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-bold tracking-tight text-emerald-100 mt-1">
                {project.title}
              </h3>
              {project.subtitle && (
                <p className="font-serif italic text-xs sm:text-sm text-neutral-300 mt-0.5">
                  {project.subtitle}
                </p>
              )}
            </div>

            {/* Summary */}
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed font-sans">
              {project.summary || project.context}
            </p>

            {/* Architecture */}
            {project.architecture && project.architecture.length > 0 && (
              <div className="bg-black/60 p-3.5 rounded border border-emerald-900/40 space-y-1.5 font-mono text-xs text-neutral-300">
                <div className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                  &gt; LOCAL SYSTEM SPECIFICATIONS
                </div>
                {project.architecture.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold select-none">&gt;</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Metrics & Tech Stack */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-emerald-900/40">
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-mono text-[10px] rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="font-mono text-xs text-emerald-400 font-bold">
                    {project.metricValue}
                  </span>
                  <span className="text-[10px] text-neutral-400 block font-mono">
                    {project.metricLabel}
                  </span>
                </div>

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-900/40 border border-emerald-700/60 text-emerald-200 font-mono text-xs hover:bg-emerald-800/40 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Repo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bezel Controls: Rocker Switch */}
        <div className="flex items-center justify-between mt-4 pt-2 text-xs font-mono text-neutral-400">
          <span className="text-[10px] text-neutral-500">
            PHOSPHOR CRT EMULATOR // ZERO EXTERNAL TELEMETRY
          </span>
          <button
            onClick={() => setPowerOn(!powerOn)}
            className="flex items-center gap-2 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 transition-colors cursor-pointer"
            title="Toggle Monitor Power"
          >
            <Power className="w-3 h-3 text-red-400" />
            <span className="text-[10px]">{powerOn ? "POWER: ON" : "POWER: OFF"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
