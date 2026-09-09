"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Github,
  CheckCircle2,
  Terminal,
  Zap,
  TrendingUp,
  Cpu,
  Power,
  Scissors,
} from "lucide-react";
import type { ProjectItem } from "@/lib/data/projects";

interface ArtifactFrameProps {
  project: ProjectItem;
}

export default function ArtifactFrame({ project }: ArtifactFrameProps) {
  const skin = project.artifactSkin || "boarding-pass";

  if (skin === "baggage-tag") {
    return <BaggageTagSkin project={project} />;
  }

  if (skin === "retro-crt") {
    return <RetroCrtSkin project={project} />;
  }

  if (skin === "garment-tag") {
    return <GarmentTagSkin project={project} />;
  }

  if (skin === "spiral-notebook") {
    return <SpiralNotebookSkin project={project} />;
  }

  // Default skin: boarding-pass
  return <BoardingPassSkin project={project} />;
}

/* =========================================================================
   SKIN 1: BOARDING PASS / PERFORATED FINANCIAL AUDIT TICKET
   ========================================================================= */
function BoardingPassSkin({ project }: { project: ProjectItem }) {
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

/* =========================================================================
   SKIN 2: BAGGAGE TAG / LUGGAGE INSPECTION ARTIFACT
   ========================================================================= */
function BaggageTagSkin({ project }: { project: ProjectItem }) {
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

/* =========================================================================
   SKIN 3: RETRO CRT MONITOR DISPLAY ARTIFACT
   ========================================================================= */
function RetroCrtSkin({ project }: { project: ProjectItem }) {
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
        <div className={`crt-screen p-5 sm:p-7 transition-all duration-300 relative overflow-hidden ${
          powerOn ? "opacity-100" : "opacity-20"
        }`}>
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

/* =========================================================================
   SKIN 4: GARMENT CARE TAG ARTIFACT
   ========================================================================= */
function GarmentTagSkin({ project }: { project: ProjectItem }) {
  return (
    <article className="relative w-full max-w-4xl mx-auto my-10 group">
      <div className="washi-tape -top-3 right-10 rotate-1" />

      <div className="bg-[#fcfaf5] text-neutral-900 rounded-md border border-neutral-300 shadow-xl overflow-hidden p-6 sm:p-8">
        
        {/* Top Stitch Line */}
        <div className="border-b-2 border-dashed border-neutral-400 pb-4 mb-4 flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase font-bold">
            GARMENT & FABRIC SPECIFICATION // {project.category}
          </span>
          <div className="flex items-center gap-2 text-neutral-500 text-xs">
            <Scissors className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px]">CUT ALONG LINE</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-neutral-900">
              {project.title}
            </h3>
            {project.subtitle && (
              <p className="font-serif italic text-xs text-neutral-600 mt-0.5">
                {project.subtitle}
              </p>
            )}
          </div>

          <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed">
            {project.summary || project.context}
          </p>

          {/* Care Icons / Composition Mock */}
          <div className="py-2 border-y border-neutral-200 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-neutral-600">
            <div className="space-x-4">
              <span>MACHINE WASH COLD</span>
              <span>•</span>
              <span>100% OPEN SOURCE</span>
              <span>•</span>
              <span>DO NOT OVERFIT</span>
            </div>
            <div className="font-bold text-neutral-800">
              METRIC: {project.metricValue} ({project.metricLabel})
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap gap-1">
              {project.techStack.map((t) => (
                <span key={t} className="px-2 py-0.5 bg-neutral-100 border border-neutral-300 rounded text-[10px] font-mono">
                  {t}
                </span>
              ))}
            </div>

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-900 hover:text-[#d94e34]"
              >
                <Github className="w-3.5 h-3.5" />
                <span>View Source</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================================
   SKIN 5: SPIRAL NOTEBOOK SKETCHBOOK ARTIFACT
   ========================================================================= */
function SpiralNotebookSkin({ project }: { project: ProjectItem }) {
  const wireCount = project.artifactMetadata?.wireCount || 10;

  return (
    <article className="relative w-full max-w-4xl mx-auto my-12 group">
      {/* Wire Rings Across Top */}
      <div className="flex items-center justify-around px-8 -mb-3 relative z-30 pointer-events-none">
        {[...Array(wireCount)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-2.5 h-7 rounded-full bg-gradient-to-r from-neutral-400 via-neutral-200 to-neutral-500 shadow-md border border-neutral-600/40" />
            <div className="w-2 h-2 rounded-full bg-black/40 -mt-1" />
          </div>
        ))}
      </div>

      {/* Ruled Paper Sheet */}
      <div className="relative bg-graph-paper rounded-lg shadow-2xl overflow-hidden border border-[#e2d9cc] p-6 sm:p-8 pt-8">
        
        {/* Red Margin Line */}
        <div className="absolute top-0 bottom-0 left-12 w-0.5 bg-red-400/40 pointer-events-none" />

        <div className="pl-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-300 pb-2">
            <span className="font-mono text-[10px] uppercase font-bold text-[#d94e34]">
              NOTEBOOK LOG // {project.category}
            </span>
            <span className="font-mono text-xs text-neutral-500">
              STATUS: {project.status}
            </span>
          </div>

          <div>
            <h3 className="font-serif text-2xl font-bold text-neutral-900">
              {project.title}
            </h3>
            {project.subtitle && (
              <p className="font-serif italic text-xs sm:text-sm text-neutral-600 mt-0.5">
                {project.subtitle}
              </p>
            )}
          </div>

          <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed">
            {project.summary || project.context}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-neutral-300">
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 bg-white border border-neutral-300 font-mono text-[10px] text-neutral-700 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {project.metricValue && (
                <span className="font-mono text-xs font-bold text-neutral-800">
                  {project.metricValue} ({project.metricLabel})
                </span>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-900 hover:text-[#d94e34]"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Repo</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
