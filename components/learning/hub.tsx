'use client';

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LearningData } from "@/types/learning";
import { Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { CourseCard } from './course-card';

interface LearningHubProps {
  userId: string;
  learningData: LearningData;
}

export function LearningHub({ userId, learningData }: LearningHubProps) {
  const router = useRouter();

  const handleCourseClick = (course: any) => {
    router.push(`/learning/course/build?topic=${course.name}&level=${course.level}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Your Learning Journey</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Continue your learning adventure.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Current Progress</h3>
          <Progress 
            value={learningData.currentPath?.progress ?? 0} 
            className="mb-2" 
          />
          <p className="text-sm text-muted-foreground">
            {learningData.currentPath?.progress ?? 0}% Complete
          </p>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Recommended Courses</h3>
            {!learningData.recommendedCourses ? (
              <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm text-muted-foreground">
                  Generating personalized course recommendations...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {learningData.recommendedCourses.map((course) => (
                  <CourseCard 
                    key={course.id} 
                    course={course}
                    onClick={() => handleCourseClick(course)}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>

        {learningData.activeChallenges.length > 0 && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Active Challenges</h3>
            {/* Challenge content */}
          </Card>
        )}
      </div>
    </div>
  );
}
