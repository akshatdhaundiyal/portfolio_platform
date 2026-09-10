"use client";

import React from "react";
import { Scissors, Github } from "lucide-react";
import type { ProjectItem } from "@/lib/data/projects";

export default function GarmentTagSkin({ project }: { project: ProjectItem }) {
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
                <span
                  key={t}
                  className="px-2 py-0.5 bg-neutral-100 border border-neutral-300 rounded text-[10px] font-mono"
                >
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
