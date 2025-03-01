import { Suspense } from 'react';
import { ForumView } from "@/components/forums/forum-view";
import { getForumBySlug } from "@/lib/actions/forum";
import { notFound } from "next/navigation";

interface ForumPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ForumPage({
  params,
}: ForumPageProps) {
  // Await the params first
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const forum = await getForumBySlug(slug);
  
  if (!forum) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading forum...</div>}>
      <ForumView forum={forum} />
    </Suspense>
  );
}
