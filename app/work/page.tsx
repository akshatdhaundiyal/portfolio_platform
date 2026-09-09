import React from "react";
import ArtifactFrame from "@/components/artifacts/ArtifactFrame";
import OtherWorkList from "@/components/OtherWorkList";
import { getAllProjects } from "@/lib/projects";
import { Layers } from "lucide-react";

export const revalidate = 0;

export const metadata = {
  title: "Case Studies & Physical Artifacts | Akshat Dhaundiyal",
  description:
    "Executive strategic case studies and active engineering prototypes by Akshat Dhaundiyal.",
};

export default async function WorkPage() {
  const allProjects = await getAllProjects();

  const flagshipProjects = allProjects.filter(
    (p) => p.section === "recently-made" || p.section === "currently-cooking"
  );
  const otherProjects = allProjects.filter((p) => p.section === "other-work");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
      {/* Top Banner */}
      <div className="space-y-3 border-b border-white/[0.08] pb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-xs">
          <Layers className="w-3.5 h-3.5" />
          <span>PORTFOLIO DIRECTORY // CASE STUDY ARTIFACTS</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
          Strategic Works & Systems.
        </h1>

        <p className="font-sans text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
          Tactile editorial artifacts documenting production machine learning systems, enterprise unit economics, and computer vision appliances.
        </p>
      </div>

      {/* Flagship Artifacts */}
      <section className="space-y-16">
        {flagshipProjects.map((project) => (
          <ArtifactFrame key={project.id} project={project} />
        ))}
      </section>

      {/* Other Work Section */}
      {otherProjects.length > 0 && (
        <section className="pt-8">
          <OtherWorkList projects={otherProjects} />
        </section>
      )}
    </div>
  );
}
