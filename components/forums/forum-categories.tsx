import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ForumCategoriesProps {
  forums: any[]; // Replace with proper type
}

export function ForumCategories({ forums }: ForumCategoriesProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Categories</h2>
      <div className="grid gap-4">
        {forums.map((forum) => (
          <Card key={forum.id} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <Link 
                  href={`/forums/${forum.slug}`}
                  className="text-xl font-semibold hover:text-primary hover:underline"
                >
                  {forum.name}
                </Link>
                <p className="text-muted-foreground mt-1">
                  {forum.description}
                </p>
              </div>
              <div className="text-sm text-muted-foreground space-y-1 text-right">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {forum._count.topics} topics
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  {forum._count.posts} posts
                </div>
              </div>
            </div>

            {forum.recentTopics?.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-2">Recent Topics:</div>
                <div className="space-y-2">
                  {forum.recentTopics.map((topic: any) => (
                    <div key={topic.id} className="flex items-center justify-between">
                      <Link 
                        href={`/forums/${forum.slug}/${topic.id}`}
                        className="text-sm hover:underline"
                      >
                        {topic.title}
                      </Link>
                      <Badge variant="secondary">
                        {formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true })}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
