'use client';

import { useState } from 'react';
import { TopicPosts } from './topic-posts';
import { TopicReplyForm } from './topic-reply-form';

interface TopicDiscussionProps {
  topicId: string;
}

export function TopicDiscussion({ topicId }: TopicDiscussionProps) {
  const [posts, setPosts] = useState<any[]>([]);

  const handleNewPost = (post: any) => {
    setPosts(current => [...current, post]);
  };

  return (
    <div>
      <TopicPosts topicId={topicId} posts={posts} setPosts={setPosts} />
      <TopicReplyForm topicId={topicId} onPostCreated={handleNewPost} />
    </div>
  );
}
