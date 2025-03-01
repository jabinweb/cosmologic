import { TopicHeader } from "@/components/forum/topic-header";
import { TopicDiscussion } from "@/components/forum/topic-discussion";
import { getTopic } from "@/lib/actions/forum";
import { notFound } from "next/navigation";

interface TopicPageProps {
  params: Promise<{ slug: string; topicId: string }>;
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { topicId, slug } = await params;
  const topic = await getTopic(topicId);

  if (!topic) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <TopicHeader topic={topic} />
      <TopicDiscussion topicId={topicId} />
    </div>
  );
}
