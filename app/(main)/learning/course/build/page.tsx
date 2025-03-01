import { Suspense } from 'react';
import { buildCourse } from '@/lib/course-builder';
import { CourseContent } from '@/components/learning/course-content';
import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { getUserCourseProgress } from '@/lib/actions/learning';

interface PageProps {
  searchParams: Promise<{ 
    topic?: string; 
    level?: string;
  }>;
}

export default async function CourseBuildPage({
  searchParams,
}: PageProps) {
  const user = await getAuthUser();
  if (!user) redirect('/login');

  const params = await searchParams;
  const topic = String(params?.topic || '');
  const level = String(params?.level || '');

  if (!topic || !level) {
    return redirect('/learning/hub');
  }

  const courseData = await buildCourse(topic, level);
  const progress = await getUserCourseProgress(user.id, courseData.id);

  return (
    <div className="container py-8">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <p>Loading course content...</p>
        </div>
      }>
        <CourseContent 
          topic={topic}
          courseData={courseData}
          initialProgress={progress}
        />
      </Suspense>
    </div>
  );
}
