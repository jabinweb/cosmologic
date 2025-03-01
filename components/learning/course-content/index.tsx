'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ModuleList } from './module-list';
import { ActivityView } from './activity-view';
import { Achievements } from './achievements';
import { useProgress } from '@/hooks/use-progress';
import { CourseData, CourseProgress, Activity } from '@/types/course';
import { CourseStatus } from './course-status';
import { ModuleCompletionActivity } from './module-completion-activity';

interface CourseContentProps {
  topic: string;
  courseData: CourseData;
  initialProgress: CourseProgress | null;
}

export function CourseContent({ topic, courseData, initialProgress }: CourseContentProps) {
  const { progress, updateProgress, resetProgress } = useProgress(courseData.id, initialProgress);
  const [showContent, setShowContent] = useState(true);
  const [showingModuleCompletion, setShowingModuleCompletion] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(
    progress.currentModuleId || courseData.modules[0]?.id || null
  );
  const [currentActivityId, setCurrentActivityId] = useState<string | null>(
    progress.currentActivityId || courseData.modules[0]?.activities[0]?.id || null
  );

  // Effect to handle initial progress
  useEffect(() => {
    if (initialProgress) {
      setShowContent(false);
    }
  }, [initialProgress]);

  const handleResume = () => {
    setShowContent(true);
  };

  const handleRestart = () => {
    resetProgress();
    setShowContent(true);
  };

  // Early return after all hooks are declared
  if (!showContent) {
    return (
      <CourseStatus 
        progress={initialProgress}
        onResume={handleResume}
        onRestart={handleRestart}
      />
    );
  }

  const currentModule = courseData.modules.find(m => m.id === currentModuleId);
  const currentActivity = currentModule?.activities.find(a => a.id === currentActivityId);
  
  const currentActivityIndex = currentModule?.activities.findIndex(a => a.id === currentActivityId) ?? 0;
  const isLastActivity = currentActivityIndex === (currentModule?.activities.length ?? 0) - 1;

  const isActivityCompleted = (moduleId: string, activityId: string): boolean => {
    return progress.modules[moduleId]?.activities[activityId]?.completed ?? false;
  };

  const handleActivityComplete = () => {
    if (!currentModule || !currentActivity) return;

    updateProgress({
      moduleId: currentModule.id,
      activityId: currentActivity.id,
      score: 100
    });

    // Save the current position
    if (!isLastActivity) {
      const nextActivity = currentModule.activities[currentActivityIndex + 1];
      if (nextActivity) {
        setCurrentActivityId(nextActivity.id);
      }
    }
  };

  const handleModuleComplete = async () => {
    if (!currentModule) return;

    if (currentModule.completionActivity) {
      setShowingModuleCompletion(true);
    } else {
      // Move to next module directly
      const nextModule = courseData.modules.find(m => m.order === currentModule.order + 1);
      if (nextModule) {
        updateProgress({
          moduleId: currentModule.id,
          activityId: 'module-complete',
          score: 100,
          isModuleCompletion: true
        });
        setCurrentModuleId(nextModule.id);
        setCurrentActivityId(nextModule.activities[0].id);
      }
    }
  };

  const handleCompletionActivityFinish = (score: number) => {
    if (!currentModule) return;

    updateProgress({
      moduleId: currentModule.id,
      activityId: 'module-complete',
      score,
      isModuleCompletion: true
    });

    // Move to next module
    const nextModule = courseData.modules.find(m => m.order === currentModule.order + 1);
    if (nextModule) {
      setCurrentModuleId(nextModule.id);
      setCurrentActivityId(nextModule.activities[0].id);
    }
    setShowingModuleCompletion(false);
  };

  const canShowModuleComplete = 
    isLastActivity && 
    currentModule?.activities.every(activity => 
      isActivityCompleted(currentModule.id, activity.id)
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <ModuleList 
          modules={courseData.modules}
          currentModuleId={currentModule?.id ?? null}
          progress={progress}
          onModuleSelect={(moduleId) => {
            const index = courseData.modules.findIndex(m => m.id === moduleId);
            if (index !== -1) {
              setCurrentModuleId(moduleId);
              setCurrentActivityId(courseData.modules[index].activities[0].id);
            }
          }}
        />
      </div>

      <div className="lg:col-span-2">
        <Card className="p-6 space-y-6">
          {currentActivity && currentModule && (
            <ActivityView 
              module={currentModule}
              activity={currentActivity}
              isCompleted={isActivityCompleted(currentModule.id, currentActivity.id)}
              onComplete={handleActivityComplete}
              showNextButton={!isLastActivity}
            />
          )}

          {canShowModuleComplete && (
            <div className="flex justify-end pt-4 border-t">
              <Button
                size="lg"
                onClick={handleModuleComplete}
              >
                Next Module
              </Button>
            </div>
          )}
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Achievements 
          unlockedAchievements={progress.achievements}
          achievements={courseData.gamification?.achievements || []}
        />
      </div>

      {showingModuleCompletion && currentModule?.completionActivity && (
        <ModuleCompletionActivity
          activity={currentModule.completionActivity}
          onComplete={handleCompletionActivityFinish}
        />
      )}
    </div>
  );
}
