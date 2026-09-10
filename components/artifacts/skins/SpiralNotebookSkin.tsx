"use client";

import React from "react";
import { Github } from "lucide-react";
import type { ProjectItem } from "@/lib/data/projects";

export default function SpiralNotebookSkin({ project }: { project: ProjectItem }) {
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
