import { PrismaClient } from "@prisma/client";
import { initialBlogs } from "../lib/data/initialBlogs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding technical papers and blogs into PostgreSQL...");

  for (const blog of initialBlogs) {
    const existing = await prisma.blog.findUnique({
      where: { slug: blog.slug },
    });

    if (!existing) {
      await prisma.blog.create({
        data: {
          slug: blog.slug,
          title: blog.title,
          subtitle: blog.subtitle,
          category: blog.category,
          summary: blog.summary,
          readTime: blog.readTime,
          accentColor: blog.accentColor,
          tags: blog.tags,
          featured: blog.featured,
          content: blog.content,
          status: blog.status,
        },
      });
      console.log(`Created blog: ${blog.title}`);
    } else {
      console.log(`Blog already exists: ${blog.title}`);
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
