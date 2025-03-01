'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export function ForumHeader() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Discussion Forums</h1>
        <p className="text-muted-foreground mt-1">
          Join conversations with fellow learners and instructors
        </p>
      </div>

      {user && (
        <Button onClick={() => router.push('/forums/new')} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Topic
        </Button>
      )}
    </div>
  );
}
