import { CreateTopicForm } from "@/components/forums/create-topic-form";
import { getForumBySlug } from "@/lib/actions/forum";
import { notFound } from "next/navigation";

interface NewTopicPageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewTopicPage({ params }: NewTopicPageProps) {
  const { slug } = await params;
  const forum = await getForumBySlug(slug);

  if (!forum) {
    notFound();
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Topic in {forum.name}</h1>
      <CreateTopicForm forumId={forum.id} forumSlug={forum.slug} />
    </div>
  );
}
