export interface MediumUser {
  id: string;
  username: string;
  name: string;
  url: string;
  imageUrl?: string;
}

export interface MediumPostPayload {
  title: string;
  content: string;
  tags?: string[];
  canonicalUrl?: string;
  publishStatus?: "public" | "draft" | "unlisted";
}

export interface MediumPostResponse {
  id: string;
  title: string;
  authorId: string;
  url: string;
  canonicalUrl?: string;
  publishStatus: string;
  publishedAt: number;
}

export async function getMediumUser(token: string): Promise<MediumUser> {
  const res = await fetch("https://api.medium.com/v1/me", {
    headers: {
      Authorization: `Bearer ${token.trim()}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Medium API authentication failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return data.data;
}

export async function publishToMedium(
  token: string,
  authorId: string,
  payload: MediumPostPayload
): Promise<MediumPostResponse> {
  // Medium tags limit is max 5 tags, each <= 25 chars, alphanumeric with hyphens
  const formattedTags = (payload.tags || [])
    .slice(0, 5)
    .map((t) => t.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase().slice(0, 25))
    .filter(Boolean);

  const res = await fetch(`https://api.medium.com/v1/users/${authorId}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.trim()}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      title: payload.title,
      contentFormat: "markdown",
      content: payload.content,
      tags: formattedTags,
      canonicalUrl: payload.canonicalUrl,
      publishStatus: payload.publishStatus || "draft",
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to publish to Medium (${res.status}): ${errorText}`);
  }

  const result = await res.json();
  return result.data;
}
