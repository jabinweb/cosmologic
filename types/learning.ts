export type LearningStyle = 'visual' | 'auditory' | 'reading' | 'kinesthetic';
export type StudyPace = 'self-paced' | 'structured';
export type GroupPreference = 'individual' | 'group' | 'mixed';

export interface AssessmentData {
  basicInfo: {
    gradeLevel: number;
    age: number;
    previousEducation: string;
    languagePreference: string[];
    deviceAccess: string[];
    internetConnection: 'stable' | 'unstable';
  };
  preferences: {
    learningStyles: LearningStyle[];
    studyTime: {
      preferredHours: number[];
      daysPerWeek: number;
    };
    pacePreference: StudyPace;
    groupPreference: GroupPreference;
  };
  goals: {
    immediateGoals: string[];
    longTermGoals: string[];
    areasOfInterest: string[];
    careerAspirations: string[];
    certificationsDesired: boolean;
  };
}

export interface AssessmentStatus {
  lastCompleted: string; // ISO date string
  nextAvailable: string; // ISO date string
  attempts: number;
  results: AssessmentData;
}

export interface AssessmentHistory {
  lastCompleted: string;
  nextAvailable: string;
  attempts: number;
  results: AssessmentData[];
}

export interface LearningPath {
  id: string;
  name: string;
  progress: number;
  currentModule: string;
  nextMilestone: string;
  aiSuggestions?: string;  // Add this field
}

export interface Challenge {
  id: string;
  title: string;
  type: 'quiz' | 'project' | 'exercise';
  dueDate: string;
  completed: boolean;
}

export interface StudyGroup {
  id: string;
  name: string;
  members: number;
  topic: string;
  nextSession?: string;
}

export interface Topic {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Tip {
  id: string;
  content: string;
  type: 'study' | 'practice' | 'motivation';
}

export interface Course {
  id: string;
  name: string;
  description: string;
  mode: string;
  price: number;
  features: string;
  tags: string; // JSON string of tags
  level: string;
  instructorId: string;
  instructor: {
    name: string;
    avatar: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseData {
  modules: Array<{
    id: string;
    title: string;
    description: string;
    duration: string;
    activities: any[]; // Define proper activity type if needed
  }>;
  gamification?: {
    achievements: Array<{
      id: string;
      name: string;
      description: string;
      points: number;
    }>;
    challenges: any[]; // Define proper challenge type if needed
  };
}

export interface CourseContentProps {
  topic: string;
  courseData: CourseData;
}

export interface LearningData {
  assessment: AssessmentData;
  achievements: string[];
  skills: string[];
  recommendedCourses: Course[];
  currentPath?: LearningPath;
  activeChallenges: Challenge[];
  studyGroups: StudyGroup[];
  suggestedTopics: Topic[];
  tips: Tip[];
}

export interface Profile {
  assessmentData: string | null;
  assessmentHistory: AssessmentHistory | null;
  // ...other fields...
}
