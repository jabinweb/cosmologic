'use client';

import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Pin, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Forum } from '@/lib/actions/forum';

interface ForumViewProps {
  forum: Forum;
}

export function ForumView({ forum }: ForumViewProps) {
  const { user } = useAuth();

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{forum.name}</h1>
          <p className="text-muted-foreground mt-1">{forum.description}</p>
        </div>
        {user && (
          <Button asChild>
            <Link href={`/forums/${forum.slug}/new`}>
              <Plus className="w-4 h-4 mr-2" />
              New Topic
            </Link>
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {forum.topics.map((topic: any) => (
          <Card key={topic.id} className="p-4">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={topic.author.avatar} />
                <AvatarFallback>{topic.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {topic.isPinned && (
                    <Pin className="w-4 h-4 text-muted-foreground" />
                  )}
                  <Link 
                    href={`/forums/${forum.slug}/${topic.id}`} // Updated route pattern
                    className="text-lg font-semibold hover:underline truncate"
                  >
                    {topic.title}
                  </Link>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  by {topic.author.name} · {formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true })}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="secondary">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {topic._count.posts}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
