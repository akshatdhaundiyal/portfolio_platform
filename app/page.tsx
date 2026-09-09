import React from "react";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import CurrentlyCookingCard from "@/components/CurrentlyCookingCard";
import ArtifactFrame from "@/components/artifacts/ArtifactFrame";
import OtherWorkList from "@/components/OtherWorkList";
import { getAllProjects } from "@/lib/projects";
import { getAllBlogs } from "@/lib/blogs";
import BlogCard from "@/components/BlogCard";
import { ArrowRight, BookOpen, ExternalLink, Github, Linkedin, Mail, Twitter } from "lucide-react";

export const revalidate = 0; // Fresh dynamic data on every request

export default async function HomePage() {
  const allProjects = await getAllProjects();
  const latestBlogs = await getAllBlogs({ status: "published" });

  const cookingProject =
    allProjects.find((p) => p.section === "currently-cooking") || allProjects[0];
  const recentlyMadeProjects = allProjects.filter((p) => p.section === "recently-made");
  const otherWorkProjects = allProjects.filter((p) => p.section === "other-work");

  return (
    <div className="space-y-20 sm:space-y-28 pb-24">
      {/* 1. Hero & Craft Definition (Jackie Zhang & Jackie Hu style) */}
      <HeroSection />

      {/* 2. "Currently cooking ☺︎" (Work in Progress feature from jackiehu.design) */}
      {cookingProject && <CurrentlyCookingCard project={cookingProject} />}

      {/* 3. "Recently Made ▶" (Flagship Works in Polymorphic Physical Artifact Skins) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-black/10 dark:border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Recently Made <span className="text-[#d94e34]">▶</span>
            </h2>
            <span className="hidden sm:inline-block font-handwritten text-lg text-neutral-600 dark:text-neutral-400 -rotate-1">
              physical artifact records
            </span>
          </div>

          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <span>All Works</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Dynamic Artifact List */}
        <div className="space-y-16">
          {recentlyMadeProjects.map((project) => (
            <ArtifactFrame key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* 4. "Other Work ⁕" (Exploratory / Side Quests from jackiehu.design) */}
      {otherWorkProjects.length > 0 && <OtherWorkList projects={otherWorkProjects} />}

      {/* 5. Selected Technical Dispatches */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Writing & Papers <span className="text-cyan-600 dark:text-cyan-400">✎</span>
            </h2>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <span>Read All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {latestBlogs.slice(0, 2).map((blog) => (
            <BlogCard key={blog.slug} blog={blog} />
          ))}
        </div>
      </section>

      {/* 6. "About ⌘" / Strategic Bio & Perspectives (from jackiehu.design) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white dark:bg-[#18191e] border border-black/10 dark:border-white/[0.08] p-8 sm:p-10 space-y-6 shadow-xl dark:shadow-2xl transition-colors">
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/[0.08] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="traditional-seal text-xs font-bold">AD</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                About & Perspectives <span className="text-[#d94e34]">⌘</span>
              </h2>
            </div>
            <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
              Data Scientist & MBA
            </span>
          </div>

          <div className="font-sans text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed space-y-4">
            <p>
              I am a Data Scientist and AI product strategist focused on bridging deep machine learning architectures with commercial unit economics.
            </p>
            <p>
              At <strong>EXL Service</strong>, I served as Lead Analytics Architect, engineering actuarial GLM pricing triage systems that recovered <strong className="text-emerald-700 dark:text-emerald-400 font-mono">+$12M</strong> in commercial insurance audit exposure, and deploying sub-100ms NLP threat detection microservices on Google Vertex AI.
            </p>
            <p>
              Currently, I am pursuing my MBA to deepen my command over unit economics, enterprise go-to-market strategies, and product governance. Before that, I completed my B.Tech in Electronics & Communication at MIT Manipal, with specialization in digital signal processing and stochastic modeling.
            </p>
            <p className="italic font-serif text-neutral-600 dark:text-neutral-400 pt-2 border-t border-black/10 dark:border-white/[0.06]">
              &ldquo;I believe the best machine learning models are the ones that actually make it to production, earn the trust of human underwriters, and deliver measurable ROI.&rdquo;
            </p>
          </div>

          {/* Social Channels Strip */}
          <div className="pt-4 border-t border-black/10 dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex flex-wrap items-center gap-4 text-neutral-600 dark:text-neutral-400">
              <a
                href="https://linkedin.com/in/akshatdhaundiyal"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <span>•</span>
              <a
                href="https://github.com/akshatdhaundiyal"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                GitHub
              </a>
              <span>•</span>
              <a
                href="https://twitter.com/akshatdhaundiyal"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Twitter (𝕏)
              </a>
            </div>

            <a
              href="mailto:akshatdhaundiyal@gmail.com"
              className="text-[#d94e34] hover:underline font-semibold"
            >
              akshatdhaundiyal@gmail.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
