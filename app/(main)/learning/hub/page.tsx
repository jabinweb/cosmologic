import { getAuthUser } from "@/lib/auth";
import { getUserLearningData } from '@/lib/actions/learning';
import { LearningHub } from '@/components/learning/hub';
import { AssessmentStatusView } from '@/components/learning/assessment-status';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function LearningHubPage() {
  const user = await getAuthUser();
  if (!user) redirect('/login');

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: {
      assessmentData: true,
      assessmentStats: true
    }
  });

  const learningData = await getUserLearningData(user.id);
  const assessmentStats = profile?.assessmentStats 
    ? JSON.parse(profile.assessmentStats)
    : null;

  if (!learningData.assessment && !assessmentStats) {
    redirect('/learning/assessment');
  }

  return (
    <div className="container py-8 space-y-6">
      {assessmentStats && (
        <AssessmentStatusView status={assessmentStats} />
      )}
      <LearningHub 
        userId={user.id} 
        learningData={learningData} 
      />
    </div>
  );
}
