import { Metadata } from "next";
import { ForumHeader } from "@/components/forums/forum-header";
import { ForumCategories } from "@/components/forums/forum-categories";
import { ForumStats } from "@/components/forums/forum-stats";
import { RecentTopics } from "@/components/forums/recent-topics";
import { getForums, getRecentTopics } from "@/lib/actions/forum";

export const metadata: Metadata = {
  title: "Forums - Cosmologic",
  description: "Join our coding community discussions",
};

export default async function ForumsPage() {
  const forums = await getForums();
  const recentTopics = await getRecentTopics();

  return (
    <div className="container py-8">
      <ForumHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="md:col-span-3 space-y-6">
          <ForumCategories forums={forums} />
          <RecentTopics topics={recentTopics} />
        </div>
        
        <div className="space-y-6">
          <ForumStats forums={forums} />
        </div>
      </div>
    </div>
  );
}
