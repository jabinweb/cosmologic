import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AssessmentForm } from "@/components/learning/assessment-form";

interface PageProps {
  searchParams: { 
    type?: string;
  };
}

// Add this export to make the route dynamic
export const dynamic = 'force-dynamic';

export default async function AssessmentPage({ searchParams }: PageProps) {
  const user = await getAuthUser();
  if (!user) {
    redirect('/login?callbackUrl=/assessment');
  }

  // Check if user has already completed assessment
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { 
      assessmentData: true,
      assessmentStats: true 
    }
  });

  const isReassessment = searchParams.type === 'reassessment';
  const hasAssessment = Boolean(profile?.assessmentData);

  // If has assessment and not requesting reassessment, redirect to hub
  if (hasAssessment && !isReassessment) {
    redirect('/learning/hub');
  }

  // If requesting reassessment, check if allowed
  if (isReassessment && profile?.assessmentStats) {
    const stats = JSON.parse(profile.assessmentStats);
    const nextAvailable = new Date(stats.nextAvailable);
    if (nextAvailable > new Date()) {
      redirect('/learning/hub');
    }
  }

  return (
    <div className="container max-w-3xl py-8">
      <h1 className="text-3xl font-bold mb-6">
        {isReassessment ? 'Reassess Your Learning Journey' : "Let's Personalize Your Learning Journey"}
      </h1>
      <AssessmentForm 
        userId={user.id}
        isReassessment={isReassessment}
      />
    </div>
  );
}
