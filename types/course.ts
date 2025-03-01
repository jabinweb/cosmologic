export interface Activity {
  id: string;
  type: 'concept' | 'exercise' | 'project' | 'interactive';
  title: string;
  content: {
    explanation: string;
    examples: string[];
    interactiveElements: Array<{
      type: 'multipleChoice' | 'fillInBlanks' | 'matching';
      question: string;
      options: string[];
      correctAnswer: string | number;
    }>;
  };
  completed?: boolean;
  score?: number;
}

export interface CompletionActivity {
  type: 'quiz' | 'challenge';
  title: string;
  description: string;
  points: number;
  content: {
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
    }>;
  };
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  activities: Activity[];
  completionActivity?: CompletionActivity;
}

export interface CourseProgress {
  currentModuleId: string | null;
  currentActivityId: string | null;
  modules: {
    [moduleId: string]: {
      completed: boolean;
      activities: {
        [activityId: string]: {
          completed: boolean;
          score: number;
        };
      };
    };
  };
  achievements: string[];
  totalPoints: number;
}

export interface CourseData {
  id: string;
  modules: Module[];
  gamification?: {
    achievements: Array<{
      id: string;
      name: string;
      description: string;
      points: number;
    }>;
  };
}
