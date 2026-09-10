"use client";

import React from "react";
import { Zap, Github } from "lucide-react";
import type { ProjectItem } from "@/lib/data/projects";

export default function BaggageTagSkin({ project }: { project: ProjectItem }) {
  const tagNumber = project.artifactMetadata?.tagNumber || "VTX-77402-NLP";
  const stampText = project.artifactMetadata?.stampText || "SLA VERIFIED (<85MS)";

  return (
    <article className="relative w-full max-w-4xl mx-auto my-12 group">
      {/* String Loop & Metal Brass Eyelet */}
      <div className="flex flex-col items-center -mb-3 relative z-30">
        <div className="w-1.5 h-10 bg-amber-700/60 rounded-full shadow-inner" />
        <div className="metal-eyelet flex items-center justify-center -mt-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#121316]" />
        </div>
      </div>

      {/* Main Luggage Tag Container with Clipped Top Corners */}
      <div className="relative bg-graph-paper rounded-lg shadow-2xl overflow-hidden border border-[#e2d9cc]">
        {/* Top Header Tag Bar */}
        <div className="bg-[#1e293b] text-white px-6 py-3 flex items-center justify-between border-b border-slate-900">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-cyan-600 text-white font-mono text-[10px] rounded uppercase font-bold">
              BAGGAGE TAG // {project.category}
            </span>
            <span className="font-mono text-xs text-cyan-200">{tagNumber}</span>
          </div>
          <span className="font-mono text-xs text-neutral-300">
            DEPLOYED: {project.period}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-5">
            <div>
              <span className="font-mono text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">
                {project.role} {project.organization ? `• ${project.organization}` : ""}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-bold tracking-tight mt-1">
                {project.title}
              </h3>
              {project.subtitle && (
                <p className="font-serif italic text-sm text-neutral-600 mt-0.5">
                  {project.subtitle}
                </p>
              )}
            </div>

            <p className="text-neutral-800 text-sm leading-relaxed">
              {project.summary || project.context}
            </p>

            {/* Architecture bullets */}
            {project.architecture && project.architecture.length > 0 && (
              <div className="bg-white/70 p-4 rounded border border-neutral-200 space-y-2">
                <div className="font-mono text-[11px] font-bold text-cyan-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Pipeline & Cloud Architecture</span>
                </div>
                <ul className="space-y-1.5 text-xs text-neutral-700">
                  {project.architecture.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-600 font-bold select-none">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 bg-neutral-200/80 border border-neutral-300 font-mono text-[11px] text-neutral-800 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="flex items-center gap-4 pt-1">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-900 hover:text-cyan-700 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Repository</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Metric Callout & Green SLA Rubber Stamp */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6 lg:border-l lg:border-dashed lg:border-neutral-300 lg:pl-6">
            <div className="bg-slate-900 text-white p-4 rounded-md shadow-md text-center">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest block mb-1">
                System Latency SLA
              </span>
              <div className="font-serif text-3xl sm:text-4xl font-black text-cyan-400 tracking-tight">
                {project.metricValue}
              </div>
              <span className="font-mono text-[11px] text-slate-300 mt-1 block font-medium">
                {project.metricLabel}
              </span>
            </div>

            {/* Green Rubber Stamp */}
            <div className="text-center">
              <div className="rubber-stamp text-emerald-700 border-emerald-700 text-xs">
                <span>{stampText}</span>
              </div>
            </div>

            {/* Retrospective */}
            {project.learntThat && (
              <div className="learnt-sticky-note p-3 text-xs leading-snug">
                <div className="font-handwritten text-base font-bold text-neutral-800 mb-1">
                  Retrospective Note:
                </div>
                <p className="font-sans text-neutral-700 italic text-[11px]">
                  &quot;{project.learntThat}&quot;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Tag Stripe */}
        <div className="px-6 py-2.5 bg-neutral-200/60 border-t border-neutral-300 flex items-center justify-between text-[10px] font-mono text-neutral-600">
          <span>TAG // {tagNumber}</span>
          <span className="italic font-serif text-neutral-500">
            Inspection Tag • Google Vertex AI Endpoint
          </span>
        </div>
      </div>
    </article>
  );
}
