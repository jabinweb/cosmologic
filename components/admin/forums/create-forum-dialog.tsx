'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createForum } from "@/lib/actions/admin";
import { useToast } from "@/hooks/use-toast";

export function CreateForumDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await createForum({
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        slug: formData.get('slug') as string,
      });
      
      toast({
        title: "Forum created",
        description: "The forum has been created successfully.",
      });
      setOpen(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create forum.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Forum
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Forum</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label>Name</label>
            <Input name="name" required />
          </div>
          <div className="space-y-2">
            <label>Slug</label>
            <Input name="slug" required />
          </div>
          <div className="space-y-2">
            <label>Description</label>
            <Textarea name="description" required />
          </div>
          <Button type="submit">Create Forum</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
