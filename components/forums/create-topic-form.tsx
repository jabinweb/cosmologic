'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from '../forum/rich-text-editor';

interface CreateTopicFormProps {
  forumId: string;
  forumSlug: string;
}

export function CreateTopicForm({ forumId, forumSlug }: CreateTopicFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/forums/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, forumId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast({
        title: "Success",
        description: "Topic created successfully",
      });

      router.push(`/forums/${forumSlug}/${data.topic.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create topic",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          placeholder="Topic title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg"
          required
        />
      </div>
      <div>
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Write your topic content..."
        />
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Creating...' : 'Create Topic'}
      </Button>
    </form>
  );
}
