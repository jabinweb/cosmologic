'use client';

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { formatDistance } from "date-fns";
import { MessageCircle } from "lucide-react";

interface ForumListProps {
  forums: any[]; // Replace with proper type when available
}

export function ForumList({ forums }: ForumListProps) {
  return (
    <div className="grid gap-6">
      {forums.map((forum) => (
        <Card key={forum.id} className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <Link 
                href={`/forums/${forum.slug}`}
                className="text-xl font-semibold hover:underline"
              >
                {forum.name}
              </Link>
              <p className="text-muted-foreground mt-1">
                {forum.description}
              </p>
            </div>
            <div className="text-sm text-muted-foreground text-right">
              <div>{forum._count.topics} topics</div>
            </div>
          </div>

          {forum.topics.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm font-medium mb-2">Recent Topics</div>
              <div className="space-y-2">
                {forum.topics.map((topic: any) => (
                  <div key={topic.id} className="flex items-center justify-between">
                    <Link 
                      href={`/forums/${forum.slug}/${topic.id}`}
                      className="hover:underline"
                    >
                      {topic.title}
                    </Link>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {topic._count.posts}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
