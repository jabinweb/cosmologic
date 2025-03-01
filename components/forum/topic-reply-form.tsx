'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from './rich-text-editor';

interface TopicReplyFormProps {
  topicId: string;
  onPostCreated?: (post: any) => void;
}

export function TopicReplyForm({ topicId, onPostCreated }: TopicReplyFormProps) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/forums/topics/${topicId}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to post reply');
      }

      setContent('');
      toast({
        title: "Success",
        description: "Your reply has been posted.",
      });
      
      // Call the callback instead of reloading
      if (onPostCreated) {
        onPostCreated(data.post);
      }
      
    } catch (error) {
      console.error('Error posting reply:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post your reply",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <RichTextEditor 
        content={content} 
        onChange={setContent}
        placeholder="Write your reply..."
      />
      <div className="mt-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Posting...' : 'Post Reply'}
        </Button>
      </div>
    </form>
  );
}
