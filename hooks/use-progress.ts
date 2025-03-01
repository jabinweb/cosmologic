'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { CourseProgress, Module, Activity } from '@/types/course';
import { saveCourseProgress } from '@/lib/actions/learning';

interface ProgressUpdate {
  moduleId: string;
  activityId: string;
  score: number;
  isModuleCompletion?: boolean;
}

export function useProgress(courseId: string, initialProgress: CourseProgress | null = null) {
  const { user } = useAuth();
  const storageKey = `course-progress-${courseId}-${user?.id}`;

  const [progress, setProgress] = useState<CourseProgress>(() => {
    if (initialProgress) return initialProgress;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {
        modules: {},
        achievements: [],
        totalPoints: 0
      };
    }
    return {
      modules: {},
      achievements: [],
      totalPoints: 0
    };
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(progress));
    
    // Save to database
    if (user?.id) {
      saveCourseProgress(user.id, courseId, progress);
    }
  }, [progress, storageKey, courseId, user?.id]);

  const updateProgress = ({ moduleId, activityId, score, isModuleCompletion }: ProgressUpdate) => {
    setProgress(prev => {
      const moduleProgress = prev.modules[moduleId] || {
        completed: false,
        activities: {}
      };

      const updatedActivities = {
        ...moduleProgress.activities,
        [activityId]: {
          completed: true,
          score
        }
      };

      return {
        ...prev,
        currentModuleId: moduleId,
        currentActivityId: activityId,
        modules: {
          ...prev.modules,
          [moduleId]: {
            completed: isModuleCompletion || false,
            activities: updatedActivities
          }
        },
        totalPoints: prev.totalPoints + score
      };
    });
  };

  const resetProgress = () => {
    const newProgress = {
      modules: {},
      achievements: [],
      totalPoints: 0,
      currentModuleId: '',
      currentActivityId: ''
    };
    setProgress(newProgress);
    localStorage.setItem(storageKey, JSON.stringify(newProgress));
  };

  const isModuleCompleted = (moduleId: string) => {
    return progress.modules[moduleId]?.completed || false;
  };

  const isActivityCompleted = (moduleId: string, activityId: string) => {
    return progress.modules[moduleId]?.activities[activityId]?.completed || false;
  };

  const canAccessModule = (moduleId: string, modules: Module[]) => {
    const currentModule = modules.find(m => m.id === moduleId);
    if (!currentModule) return false;

    // First module is always accessible
    if (currentModule.order === 0) return true;

    // Find previous module
    const prevModule = modules.find(m => m.order === currentModule.order - 1);
    if (!prevModule) return true;

    // Check if previous module is completed
    return isModuleCompleted(prevModule.id);
  };

  return {
    progress,
    updateProgress,
    resetProgress,
    isModuleCompleted,
    isActivityCompleted,
    canAccessModule
  };
}
