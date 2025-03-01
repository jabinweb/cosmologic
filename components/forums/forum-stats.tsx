import { Card } from "@/components/ui/card";
import { MessageSquare, MessageCircle } from "lucide-react";

interface Forum {
  _count: {
    topics: number;
    posts?: number;
  };
}

interface ForumStatsProps {
  forums: Forum[];
}

export function ForumStats({ forums }: ForumStatsProps) {
  const totalTopics = forums.reduce((acc, forum) => acc + (forum._count.topics || 0), 0);
  const totalPosts = forums.reduce((acc, forum) => acc + (forum._count.posts || 0), 0);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Forum Statistics</h2>
      <Card>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-2xl font-bold">{totalTopics.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Topics</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-2xl font-bold">{totalPosts.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Posts</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
