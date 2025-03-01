'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updateForum } from "@/lib/actions/admin";

interface EditForumFormProps {
  forum: {
    id: string;
    name: string;
    slug: string;
    description: string;
  };
}

export function EditForumForm({ forum }: EditForumFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      slug: formData.get('slug') as string,
    };
    
    try {
      await updateForum(forum.id, data);
      
      toast({
        title: "Forum updated",
        description: "The forum has been updated successfully.",
      });
      
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update forum.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label>Name</label>
        <Input 
          name="name" 
          defaultValue={forum.name}
          required 
        />
      </div>
      <div className="space-y-2">
        <label>Slug</label>
        <Input 
          name="slug" 
          defaultValue={forum.slug}
          required 
        />
      </div>
      <div className="space-y-2">
        <label>Description</label>
        <Textarea 
          name="description" 
          defaultValue={forum.description}
          required 
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
