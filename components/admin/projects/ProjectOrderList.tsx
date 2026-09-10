"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp, ArrowDown, Edit2, Trash2, ExternalLink } from "lucide-react";
import type { ProjectItem } from "@/lib/data/projects";

interface ProjectOrderListProps {
  projects: ProjectItem[];
  isReadOnly: boolean;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onEdit: (project: ProjectItem) => void;
  onDelete: (id: string, title: string) => void;
}

export default function ProjectOrderList({
  projects,
  isReadOnly,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
}: ProjectOrderListProps) {
  if (projects.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#18191e] border border-dashed border-[#22211f]/15 dark:border-white/15 text-xs font-mono text-[#22211f]/50 dark:text-white/50">
        No projects found. Click "Add Project" to create your first showcase artifact.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#18191e] border border-[#22211f]/10 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden">
      <div className="divide-y divide-[#22211f]/5 dark:divide-white/5">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#22211f]/2 dark:hover:bg-white/2 transition-colors"
          >
            {/* Left: Reorder Arrows & Info */}
            <div className="flex items-start gap-3 sm:gap-4">
              {!isReadOnly && (
                <div className="flex flex-col gap-1 shrink-0 pt-0.5">
                  <button
                    type="button"
                    onClick={() => onMoveUp(index)}
                    disabled={index === 0}
                    className="p-1 rounded-md text-[#22211f]/40 dark:text-white/40 hover:text-[#d94e34] hover:bg-[#d94e34]/10 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMoveDown(index)}
                    disabled={index === projects.length - 1}
                    className="p-1 rounded-md text-[#22211f]/40 dark:text-white/40 hover:text-[#d94e34] hover:bg-[#d94e34]/10 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] text-[#22211f]/40 dark:text-white/40 font-bold">
                    #{project.displayOrder || index + 1}
                  </span>
                  <span className="font-serif text-base font-bold text-[#22211f] dark:text-white">
                    {project.title}
                  </span>
                  <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-full border border-[#d94e34]/30 text-[#d94e34] bg-[#d94e34]/10">
                    {project.artifactSkin || "boarding-pass"}
                  </span>
                  <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-full border border-[#22211f]/10 dark:border-white/10 text-[#22211f]/60 dark:text-white/60">
                    {project.category}
                  </span>
                </div>

                <p className="text-xs text-[#22211f]/60 dark:text-white/60 line-clamp-1 mt-1 font-sans">
                  {project.summary || project.context}
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-[10px] text-[#22211f]/50 dark:text-white/50">
                  <span className="font-bold text-[#d94e34]">
                    {project.metricValue} ({project.metricLabel})
                  </span>
                  <span>•</span>
                  <span>{project.role}</span>
                  {project.organization && <span>• {project.organization}</span>}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <Link
                href={`/#project-${project.slug}`}
                target="_blank"
                className="p-2 rounded-lg text-[#22211f]/40 dark:text-white/40 hover:text-[#22211f] dark:hover:text-white hover:bg-[#22211f]/5 dark:hover:bg-white/5 transition-colors"
                title="View artifact on public site"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>

              {!isReadOnly && (
                <>
                  <button
                    type="button"
                    onClick={() => onEdit(project)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#22211f]/15 dark:border-white/15 text-xs font-mono hover:border-[#d94e34] hover:text-[#d94e34] transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(project.id, project.title)}
                    className="p-2 rounded-lg text-[#22211f]/40 dark:text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
