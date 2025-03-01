'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, PlayCircle } from "lucide-react";
import { CourseProgress } from "@/types/course";

interface CourseStatusProps {
  progress: CourseProgress | null;
  onResume: () => void;
  onRestart: () => void;
}

export function CourseStatus({ progress, onResume, onRestart }: CourseStatusProps) {
  if (!progress) return null;

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Course Progress</h3>
          <p className="text-sm text-muted-foreground">
            You have an existing progress for this course
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onRestart}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Restart
          </Button>
          <Button onClick={onResume}>
            <PlayCircle className="h-4 w-4 mr-2" />
            Resume
          </Button>
        </div>
      </div>
    </Card>
  );
}
