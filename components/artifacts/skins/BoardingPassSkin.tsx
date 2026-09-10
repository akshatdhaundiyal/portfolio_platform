"use client";

import React from "react";
import { Terminal, Github, ExternalLink } from "lucide-react";
import type { ProjectItem } from "@/lib/data/projects";

export default function BoardingPassSkin({ project }: { project: ProjectItem }) {
  const barcode = project.artifactMetadata?.barcode || "AUDIT-99210-EXL";
  const seatOrGate = project.artifactMetadata?.seatOrGate || "GATE 04 • ZONE A";
  const flightNo = project.artifactMetadata?.flightNo || "POLICY-2024";
  const stampText = project.artifactMetadata?.stampText || "EXECUTIVE AUDIT // VERIFIED";

  return (
    <article className="relative w-full max-w-4xl mx-auto my-12 group">
      {/* Tape strip at top */}
      <div className="washi-tape -top-3 left-12 -rotate-2" />

      {/* Main Ticket Container */}
      <div className="relative bg-graph-paper rounded-lg shadow-2xl overflow-hidden border border-[#e2d9cc]">
        {/* Ticket Header Stub */}
        <div className="bg-[#18181b] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-black">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-widest uppercase bg-[#d94e34] text-white px-2 py-0.5 rounded font-bold">
              {project.category}
            </span>
            <span className="font-mono text-xs text-neutral-400">
              STUB REF: {barcode}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-300">
            <span>{seatOrGate}</span>
            <span className="text-neutral-500">•</span>
            <span>{flightNo}</span>
            <span className="text-neutral-500">•</span>
            <span className="text-emerald-400 font-bold">{project.period}</span>
          </div>
        </div>

        {/* Ticket Body: Two-Column Split (Executive Impact vs System Architecture) */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          {/* Left / Main Section (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">
                  {project.role} {project.organization ? `— ${project.organization}` : ""}
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-bold tracking-tight">
                {project.title}
              </h3>
              {project.subtitle && (
                <p className="font-serif italic text-sm text-neutral-600 mt-1">
                  {project.subtitle}
                </p>
              )}
            </div>

            {/* Context & Summary */}
            <p className="text-neutral-800 text-sm leading-relaxed">
              {project.summary || project.context}
            </p>

            {/* Architecture Highlights */}
            {project.architecture && project.architecture.length > 0 && (
              <div className="bg-white/80 p-4 rounded border border-neutral-200 space-y-2">
                <div className="font-mono text-[11px] font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#d94e34]" />
                  <span>Technical & Statistical Execution</span>
                </div>
                <ul className="space-y-1.5 text-xs text-neutral-700">
                  {project.architecture.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#d94e34] font-bold select-none">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded bg-black/5 border border-black/10 font-mono text-[11px] text-neutral-700 font-medium"
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
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-900 hover:text-[#d94e34] transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Repository</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#d94e34] hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Production</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Section: Metric Seal & Retrospective Post-It (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6 lg:border-l lg:border-dashed lg:border-neutral-300 lg:pl-6">
            {/* Executive Metric Callout Box */}
            <div className="bg-[#18181b] text-white p-4 rounded-md shadow-md text-center">
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">
                Verified Business Impact
              </span>
              <div className="font-serif text-3xl sm:text-4xl font-black text-[#d94e34] tracking-tight">
                {project.metricValue}
              </div>
              <span className="font-mono text-[11px] text-neutral-300 mt-1 block font-medium">
                {project.metricLabel}
              </span>
            </div>

            {/* Rubber Ink Stamp */}
            <div className="text-center py-1">
              <div className="rubber-stamp text-[#d94e34] border-[#d94e34] text-xs">
                <span>{stampText}</span>
              </div>
            </div>

            {/* Retrospective Note */}
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

        {/* Perforated Tear Line with Notches */}
        <div className="relative border-t-2 border-dashed border-neutral-400 my-1">
          <div className="ticket-notch-left -top-3" />
          <div className="ticket-notch-right -top-3" />
        </div>

        {/* Bottom Barcode Strip */}
        <div className="px-6 py-3 bg-[#e8ded0] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-neutral-600">
          <div className="tracking-widest flex items-center gap-1 font-bold">
            <span className="h-4 w-1 bg-neutral-800 inline-block" />
            <span className="h-4 w-2 bg-neutral-800 inline-block" />
            <span className="h-4 w-0.5 bg-neutral-800 inline-block" />
            <span className="h-4 w-3 bg-neutral-800 inline-block" />
            <span className="h-4 w-1 bg-neutral-800 inline-block" />
            <span className="ml-2">{barcode}</span>
          </div>
          <span className="italic font-serif text-neutral-500">
            Perforated Ticket Stub • Enterprise AI Architecture
          </span>
        </div>
      </div>
    </article>
  );
}
