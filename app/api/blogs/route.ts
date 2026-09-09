import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { getAllBlogs } from "@/lib/blogs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || "published";

    const authed = await isAuthenticated();
    // If user is super admin, allow viewing drafts
    const targetStatus = authed && searchParams.get("all") === "true" ? undefined : status;

    const blogs = await getAllBlogs({ category, search, status: targetStatus });
    return NextResponse.json(blogs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized: Super Admin access required." }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      slug,
      subtitle,
      category,
      summary,
      readTime,
      accentColor,
      tags,
      featured,
      content,
      coverImage,
      status,
    } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
    }

    // Auto-generate slug if not provided
    const safeSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newBlog = await prisma.blog.create({
      data: {
        slug: safeSlug,
        title,
        subtitle: subtitle || null,
        category: category || "Applied ML",
        summary: summary || title,
        readTime: readTime || "5 min read",
        accentColor: accentColor || "#6366f1",
        tags: Array.isArray(tags) ? tags : [],
        featured: Boolean(featured),
        content,
        coverImage: coverImage || null,
        status: status || "published",
      },
    });

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A blog with this slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message || "Failed to create blog" }, { status: 500 });
  }
}
