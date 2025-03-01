'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export function LearningHub({ 
  userId, 
  learningData 
}: { 
  userId: string;
  learningData: any;
}) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Your Learning Journey</h1>
          <p className="text-muted-foreground mt-2">
            Continue where you left off
          </p>
        </div>
        
        <Button>
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Study Time
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Overview */}
        <Card className="p-4">
          {/* Card content for progress */}
        </Card>

        {/* Recommended Courses */}
        <Card className="p-4 md:col-span-2">
          {/* Card content for courses */}
        </Card>

        {/* Study Groups */}
        <Card className="p-4">
          {/* Card content for study groups */}
        </Card>

        {/* AI Mentor */}
        <Card className="p-4">
          {/* Card content for AI assistance */}
        </Card>
      </div>
    </div>
  );
}
