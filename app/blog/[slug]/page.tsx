import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogBySlug } from "@/lib/blogs";
import BlogContentRenderer from "@/components/BlogContentRenderer";
import { ArrowLeft, ArrowUpRight, Clock, Share2, Sparkles, Tag } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return { title: "Article Not Found" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://akshatdhaundiyal.com";
  const canonicalUrl = `${siteUrl}/blog/${blog.slug}`;

  return {
    title: `${blog.title} | Akshat Dhaundiyal`,
    description: blog.summary,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: blog.title,
      description: blog.summary,
      type: "article",
      url: canonicalUrl,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Top Back Navigation & Medium Link */}
      <div className="flex items-center justify-between gap-4 border-b border-black/10 dark:border-white/[0.08] pb-6 font-mono text-xs">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Papers</span>
        </Link>

        {blog.mediumUrl && (
          <a
            href={blog.mediumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00AB6C]/10 border border-[#00AB6C]/30 text-[#00AB6C] hover:bg-[#00AB6C]/20 transition-all font-semibold"
          >
            <span>Read on Medium</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Article Header */}
      <header className="space-y-6">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <span className="px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold">
            {blog.category}
          </span>
          <span className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{blog.readTime}</span>
          </span>
          <span className="text-neutral-400 dark:text-neutral-600">•</span>
          <span className="text-neutral-600 dark:text-neutral-400">By Akshat Dhaundiyal</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-white leading-tight">
          {blog.title}
        </h1>

        {blog.subtitle && (
          <p className="text-lg sm:text-xl text-neutral-700 dark:text-neutral-300 font-normal leading-relaxed border-l-2 border-indigo-500 pl-4 py-1">
            {blog.subtitle}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {blog.tags.map((tag) => (
            <span key={tag} className="tech-tag text-xs">
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {/* Cover Image if present */}
      {blog.coverImage && (
        <div className="rounded-2xl overflow-hidden border border-black/10 dark:border-white/[0.1] max-h-[480px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Main Rich Content */}
      <div className="border-t border-black/10 dark:border-white/[0.08] pt-8">
        <BlogContentRenderer content={blog.content} />
      </div>

      {/* Footer Author Card */}
      <div className="border-t border-black/10 dark:border-white/[0.08] pt-8 mt-16 artifact-card rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center font-mono font-bold text-white text-base shadow-lg shadow-indigo-500/20">
            AD
          </div>
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white text-base">Akshat Dhaundiyal</h4>
            <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
              Data Scientist · MBA Candidate · AI PM & Systems Architect
            </p>
          </div>
        </div>
        <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
          Writing about production machine learning architectures, actuarial statistics, cloud inference systems, and product strategy. For questions or discussions, reach out at{" "}
          <a href="mailto:akshatdhaundiyal@gmail.com" className="text-cyan-700 dark:text-cyan-400 underline">
            akshatdhaundiyal@gmail.com
          </a>.
        </p>
      </div>
    </article>
  );
}
