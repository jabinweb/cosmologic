import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface RecentTopicsProps {
  topics: any[]; // Replace with proper type
}

export function RecentTopics({ topics }: RecentTopicsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recent Discussions</h2>
      <div className="grid gap-4">
        {topics.map((topic) => (
          <Card key={topic.id} className="p-4">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={topic.author.avatar} />
                <AvatarFallback>{topic.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <Link 
                  href={`/forums/${topic.forum.slug}/${topic.id}`}
                  className="font-semibold hover:underline"
                >
                  {topic.title}
                </Link>
                <div className="text-sm text-muted-foreground">
                  Posted by {topic.author.name} in {topic.forum.name}
                  {" · "}
                  {formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
