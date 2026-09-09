import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBlogBySlug } from "@/lib/blogs";
import { getMediumUser, publishToMedium } from "@/lib/medium";

export async function POST(req: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized: Super Admin access required." }, { status: 401 });
    }

    const { slug, token: userToken, publishStatus = "draft" } = await req.json();

    if (!slug) {
      return NextResponse.json({ error: "Blog slug is required." }, { status: 400 });
    }

    const token = (userToken || process.env.MEDIUM_INTEGRATION_TOKEN || "").trim();
    if (!token) {
      return NextResponse.json(
        { error: "Medium Integration Token is required. Please enter your token in the studio." },
        { status: 400 }
      );
    }

    const blog = await getBlogBySlug(slug);
    if (!blog) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }

    // Determine canonical base URL
    const host = req.headers.get("host") || "localhost:3000";
    const proto = req.headers.get("x-forwarded-proto") || "http";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${proto}://${host}`;
    const canonicalUrl = `${siteUrl}/blog/${blog.slug}`;

    // 1. Fetch authenticated Medium author profile
    const mediumUser = await getMediumUser(token);

    // 2. Prepare markdown content for Medium
    // Prepend title and subtitle if needed, and clean local relative image URLs to absolute URLs
    let mediumContent = `# ${blog.title}\n\n`;
    if (blog.subtitle) {
      mediumContent += `*${blog.subtitle}*\n\n---\n\n`;
    }
    // Replace local /uploads/ images with absolute site URL for Medium
    const processedContent = blog.content.replace(
      /!\[(.*?)\]\((\/uploads\/[^\)]+)\)/g,
      `![$1](${siteUrl}$2)`
    );
    mediumContent += processedContent;

    // Add canonical attribution note at the bottom
    mediumContent += `\n\n---\n*Originally published on [Akshat Dhaundiyal's Portfolio](${canonicalUrl})*`;

    // 3. Publish to Medium
    const mediumResult = await publishToMedium(token, mediumUser.id, {
      title: blog.title,
      content: mediumContent,
      tags: blog.tags,
      canonicalUrl,
      publishStatus,
    });

    // 4. Update database with Medium syndication metadata
    try {
      await prisma.blog.update({
        where: { slug: blog.slug },
        data: {
          mediumPostId: mediumResult.id,
          mediumUrl: mediumResult.url,
          mediumPublishedAt: new Date(mediumResult.publishedAt),
        },
      });
    } catch (dbErr) {
      console.warn("Could not persist Medium post metadata to database:", dbErr);
    }

    return NextResponse.json({
      success: true,
      mediumUrl: mediumResult.url,
      mediumPostId: mediumResult.id,
      publishStatus: mediumResult.publishStatus,
      author: mediumUser.name,
      canonicalUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to cross-post to Medium." },
      { status: 500 }
    );
  }
}
