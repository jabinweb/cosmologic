'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Quiz } from './activities/quiz';
import { Exercise } from './activities/exercise';
import { Project } from './activities/project';
import { Trophy, Video as VideoIcon, Brain, Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Concept } from './activities/concept';
import { Module, Activity } from '@/types/course';

interface ActivityViewProps {
  module: Module;
  activity: Activity;
  isCompleted: boolean;
  onComplete: () => void;
  showNextButton: boolean;
}

export function ActivityView({ 
  module, 
  activity, 
  isCompleted,
  onComplete,
  showNextButton 
}: ActivityViewProps) {

  if (!activity?.content) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Activity content not available</p>
      </div>
    );
  }

  const ActivityComponent = {
    concept: Concept,
    exercise: Exercise,
    project: Project,
    interactive: Concept // Use Concept for interactive activities too
  }[activity.type as keyof typeof ActivityComponent] as React.ElementType;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{activity.title}</h3>
        <div className={cn(
          "px-3 py-1 rounded-full text-sm",
          isCompleted ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
        )}>
          {isCompleted ? "Completed" : "In Progress"}
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h4>Explanation</h4>
        <div dangerouslySetInnerHTML={{ __html: activity.content.explanation }} />
        
        {activity.content.examples.length > 0 && (
          <>
            <h4>Examples</h4>
            {activity.content.examples.map((example, index) => (
              <div key={index} className="my-4 p-4 bg-muted rounded-lg">
                {example}
              </div>
            ))}
          </>
        )}
      </div>

      {!isCompleted && (
        <div className="flex justify-end pt-4">
          <Button onClick={onComplete}>
            {showNextButton ? "Next" : "Complete Activity"}
          </Button>
        </div>
      )}
    </div>
  );
}
