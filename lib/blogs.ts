import { prisma } from "./prisma";
import { initialBlogs, type InitialBlog } from "./data/initialBlogs";

export interface BlogPost extends InitialBlog {
  id?: string;
  mediumPostId?: string | null;
  mediumUrl?: string | null;
  mediumPublishedAt?: Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

let isBlogDbAvailable: boolean | null = null;

export async function getAllBlogs(options?: {
  status?: string;
  category?: string;
  search?: string;
}): Promise<BlogPost[]> {
  if (isBlogDbAvailable !== false) {
    try {
      const where: any = {};
      if (options?.status) {
        where.status = options.status;
      }
      if (options?.category && options.category !== "All Articles" && options.category !== "All") {
        where.category = options.category;
      }
      if (options?.search) {
        where.OR = [
          { title: { contains: options.search, mode: "insensitive" } },
          { summary: { contains: options.search, mode: "insensitive" } },
          { subtitle: { contains: options.search, mode: "insensitive" } },
        ];
      }

      const dbBlogs = await prisma.blog.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      if (dbBlogs.length > 0) {
        isBlogDbAvailable = true;
        return dbBlogs as unknown as BlogPost[];
      }
    } catch (error) {
      isBlogDbAvailable = false;
      console.warn("Blog database query failed or not initialized, using optimized in-memory cache");
    }
  }

  // Fallback to static seed array
  return initialBlogs.filter((b) => {
    if (options?.status && b.status !== options.status) return false;
    if (options?.category && options.category !== "All Articles" && options.category !== "All") {
      if (b.category !== options.category) return false;
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      const match =
        b.title.toLowerCase().includes(q) ||
        b.summary.toLowerCase().includes(q) ||
        (b.subtitle && b.subtitle.toLowerCase().includes(q)) ||
        b.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const blog = await prisma.blog.findUnique({
      where: { slug },
    });
    if (blog) return blog as unknown as BlogPost;
  } catch (error) {
    console.warn("Database fetch failed for slug, checking fallback dataset:", slug, error);
  }

  const fallback = initialBlogs.find((b) => b.slug === slug);
  return fallback || null;
}
