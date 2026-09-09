import { prisma } from "./prisma";
import { initialProjects, type ProjectItem, type ProjectSection } from "./data/projects";

// In-memory runtime cache for development/offline fallback if DB is not connected
let memoryProjects: ProjectItem[] = [...initialProjects];

export async function getAllProjects(options?: {
  section?: ProjectSection;
  featuredOnly?: boolean;
}): Promise<ProjectItem[]> {
  try {
    const where: any = {};
    if (options?.section) {
      where.section = options.section;
    }
    if (options?.featuredOnly) {
      where.featured = true;
    }

    const dbProjects = await prisma.project.findMany({
      where,
      orderBy: { displayOrder: "asc" },
    });

    if (dbProjects.length > 0) {
      return dbProjects as unknown as ProjectItem[];
    }
  } catch (error) {
    console.warn("Database query failed or not initialized, falling back to local dataset:", error);
  }

  // Fallback to local memory / static seed
  return memoryProjects
    .filter((p) => {
      if (options?.section && p.section !== options.section) return false;
      if (options?.featuredOnly && !p.featured) return false;
      return true;
    })
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function getProjectBySlug(slug: string): Promise<ProjectItem | null> {
  try {
    const dbProj = await prisma.project.findUnique({
      where: { slug },
    });
    if (dbProj) {
      return dbProj as unknown as ProjectItem;
    }
  } catch (error) {
    console.warn("Database query failed or not initialized, falling back to local dataset:", error);
  }

  return memoryProjects.find((p) => p.slug === slug) || null;
}

export async function createProject(data: Partial<ProjectItem>): Promise<ProjectItem> {
  const newProj: ProjectItem = {
    id: data.id || `proj-${Date.now()}`,
    slug: data.slug || `project-${Date.now()}`,
    title: data.title || "Untitled Project",
    subtitle: data.subtitle || "",
    category: data.category || "Applied ML",
    role: data.role || "Lead Developer",
    organization: data.organization || "",
    period: data.period || "2024",
    accentColor: data.accentColor || "#d94e34",
    metricValue: data.metricValue || "",
    metricLabel: data.metricLabel || "",
    summary: data.summary || "",
    context: data.context || "",
    learntThat: data.learntThat || "",
    architecture: data.architecture || [],
    techStack: data.techStack || [],
    tradeoffs: data.tradeoffs || [],
    artifactSkin: data.artifactSkin || "boarding-pass",
    artifactMetadata: data.artifactMetadata || {},
    section: data.section || "recently-made",
    status: data.status || "Shipped",
    displayOrder: data.displayOrder ?? memoryProjects.length + 1,
    featured: data.featured ?? true,
    githubUrl: data.githubUrl || "",
    liveUrl: data.liveUrl || "",
  };

  try {
    const created = await prisma.project.create({
      data: {
        ...newProj,
        tradeoffs: newProj.tradeoffs as any,
        artifactMetadata: newProj.artifactMetadata as any,
      },
    });
    return created as unknown as ProjectItem;
  } catch (error) {
    console.warn("Database create failed, saving to local in-memory store:", error);
  }

  memoryProjects.push(newProj);
  return newProj;
}

export async function updateProject(idOrSlug: string, updates: Partial<ProjectItem>): Promise<ProjectItem | null> {
  try {
    const updated = await prisma.project.update({
      where: { id: idOrSlug },
      data: {
        ...updates,
        tradeoffs: updates.tradeoffs as any,
        artifactMetadata: updates.artifactMetadata as any,
      },
    });
    return updated as unknown as ProjectItem;
  } catch (err) {
    // If not found by id, try by slug
    try {
      const updatedBySlug = await prisma.project.update({
        where: { slug: idOrSlug },
        data: {
          ...updates,
          tradeoffs: updates.tradeoffs as any,
          artifactMetadata: updates.artifactMetadata as any,
        },
      });
      return updatedBySlug as unknown as ProjectItem;
    } catch (e) {
      console.warn("DB update failed, updating in-memory store:", e);
    }
  }

  const idx = memoryProjects.findIndex((p) => p.id === idOrSlug || p.slug === idOrSlug);
  if (idx !== -1) {
    memoryProjects[idx] = { ...memoryProjects[idx], ...updates };
    return memoryProjects[idx];
  }
  return null;
}

export async function deleteProject(idOrSlug: string): Promise<boolean> {
  try {
    await prisma.project.delete({
      where: { id: idOrSlug },
    });
    return true;
  } catch (e) {
    try {
      await prisma.project.delete({
        where: { slug: idOrSlug },
      });
      return true;
    } catch (err) {
      console.warn("DB delete failed, deleting from in-memory store:", err);
    }
  }

  const idx = memoryProjects.findIndex((p) => p.id === idOrSlug || p.slug === idOrSlug);
  if (idx !== -1) {
    memoryProjects.splice(idx, 1);
    return true;
  }
  return false;
}

export async function reorderProjects(orders: { id: string; displayOrder: number }[]): Promise<boolean> {
  try {
    for (const item of orders) {
      await prisma.project.update({
        where: { id: item.id },
        data: { displayOrder: item.displayOrder },
      });
    }
    return true;
  } catch (e) {
    console.warn("DB batch reorder failed, updating in-memory store:", e);
  }

  for (const item of orders) {
    const p = memoryProjects.find((x) => x.id === item.id || x.slug === item.id);
    if (p) {
      p.displayOrder = item.displayOrder;
    }
  }
  memoryProjects.sort((a, b) => a.displayOrder - b.displayOrder);
  return true;
}
