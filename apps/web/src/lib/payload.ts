type PayloadPostsResponse<T> = {
  docs?: T[];
};

export type Post = {
  slug: string;
  title: string;
  content: string;
};

const payloadBaseUrl = import.meta.env.PAYLOAD_PUBLIC_SERVER_URL ?? 'http://localhost:3001';

export async function fetchPosts(): Promise<Post[]> {
  const res = await fetch(`${payloadBaseUrl}/api/posts`);
  if (!res.ok) {
    return [];
  }

  const data = (await res.json()) as PayloadPostsResponse<Post>;
  return data?.docs ?? [];
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const res = await fetch(
    `${payloadBaseUrl}/api/posts?where[slug][equals]=${encodeURIComponent(slug)}`
  );
  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as PayloadPostsResponse<Post>;
  return data?.docs?.[0] ?? null;
}
