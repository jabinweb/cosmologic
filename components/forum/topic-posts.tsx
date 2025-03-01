'use client';

import { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Card } from "@/components/ui/card";

interface TopicPostsProps {
  topicId: string;
  posts: any[];
  setPosts: (posts: any[]) => void;
}

export function TopicPosts({ topicId, posts, setPosts }: TopicPostsProps) {
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`/api/forums/topics/${topicId}/posts`);
      const data = await res.json();
      setPosts(data.posts);
    };

    fetchPosts();
  }, [topicId, setPosts]);

  return (
    <div className="space-y-6 mt-8">
      {posts.map((post) => (
        <Card key={post.id} className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <Avatar>
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div 
            className="rich-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Card>
      ))}
    </div>
  );
}
