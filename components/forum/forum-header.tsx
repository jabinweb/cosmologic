'use client';

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function ForumHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Forums</h1>
        <p className="text-muted-foreground">
          Join the discussion with fellow students and instructors
        </p>
      </div>
      <Button onClick={() => router.push('/forums/new')}>
        <Plus className="w-4 h-4 mr-2" />
        New Topic
      </Button>
    </div>
  );
}
