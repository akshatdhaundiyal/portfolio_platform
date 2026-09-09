import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { getBlogBySlug } from "@/lib/blogs";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const blog = await getBlogBySlug(slug);

    if (!blog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch blog" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized: Super Admin access required." }, { status: 401 });
    }

    const { slug } = await context.params;
    const body = await req.json();

    const updatedBlog = await prisma.blog.update({
      where: { slug },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        category: body.category,
        summary: body.summary,
        readTime: body.readTime,
        accentColor: body.accentColor,
        tags: Array.isArray(body.tags) ? body.tags : undefined,
        featured: body.featured !== undefined ? Boolean(body.featured) : undefined,
        content: body.content,
        coverImage: body.coverImage,
        status: body.status,
      },
    });

    return NextResponse.json(updatedBlog);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized: Super Admin access required." }, { status: 401 });
    }

    const { slug } = await context.params;
    await prisma.blog.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true, message: "Blog deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete blog" }, { status: 500 });
  }
}
