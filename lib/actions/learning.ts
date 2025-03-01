'use server';

import { prisma } from "@/lib/prisma";
import { AssessmentData, LearningData, Course } from "@/types/learning";
import { generateLearningPath, getPersonalizedTips, getAIRecommendedCourses } from '@/lib/google-ai';

export async function saveAssessment(userId: string, data: AssessmentData) {
  const nextAvailable = new Date();
  nextAvailable.setDate(nextAvailable.getDate() + 30);

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { assessmentStats: true }
    });

    const currentStats = profile?.assessmentStats 
      ? JSON.parse(profile.assessmentStats)
      : { attempts: 0, history: [] };

    const newStats = {
      lastCompleted: new Date().toISOString(),
      nextAvailable: nextAvailable.toISOString(),
      attempts: currentStats.attempts + 1,
      history: [...currentStats.history, {
        date: new Date().toISOString(),
        data
      }]
    };

    return await prisma.profile.upsert({
      where: { userId },
      update: {
        assessmentData: JSON.stringify(data),
        assessmentStats: JSON.stringify(newStats)
      },
      create: {
        userId,
        assessmentData: JSON.stringify(data),
        assessmentStats: JSON.stringify({
          lastCompleted: new Date().toISOString(),
          nextAvailable: nextAvailable.toISOString(),
          attempts: 1,
          history: [{ date: new Date().toISOString(), data }]
        }),
        bio: '',
        achievements: '[]',
        skills: '[]',
        socialLinks: '{}'
      }
    });
  } catch (error) {
    console.error('Failed to save assessment:', error);
    throw new Error('Failed to save assessment');
  }
}

export async function getUserLearningData(userId: string): Promise<LearningData> {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: {
      assessmentData: true,
      assessmentStats: true,
      achievements: true,
      skills: true
    }
  });

  const assessmentData = profile?.assessmentData 
    ? JSON.parse(profile.assessmentData)
    : null;

  const assessmentHistory = profile?.assessmentStats
    ? JSON.parse(profile.assessmentStats)
    : null;

  let aiGeneratedPath = null;
  let personalizedTips = [];
  let recommendedCourses = [];

  if (assessmentData) {
    try {
      // Run all AI operations in parallel
      const [path, tips, courses] = await Promise.all([
        generateLearningPath(assessmentData),
        getPersonalizedTips(assessmentData, assessmentData.goals.areasOfInterest[0]),
        getAIRecommendedCourses(assessmentData)
      ]);

      aiGeneratedPath = path;
      personalizedTips = tips;
      recommendedCourses = courses;
    } catch (error) {
      console.error('AI generation error:', error);
    }
  }

  return {
    assessment: assessmentData,
    achievements: JSON.parse(profile?.achievements || '[]'),
    skills: JSON.parse(profile?.skills || '[]'),
    recommendedCourses,
    activeChallenges: [], 
    studyGroups: [], 
    suggestedTopics: [], 
    tips: personalizedTips,
    currentPath: aiGeneratedPath ? {
      id: 'generated',
      name: 'Personalized Learning Path',
      progress: 0,
      currentModule: 'Getting Started',
      nextMilestone: 'Complete First Module',
      aiSuggestions: aiGeneratedPath
    } : undefined,
  };
}

async function getRecommendedCourses(assessmentData: AssessmentData | null): Promise<Course[]> {
  if (!assessmentData) return [];

  const allCourses = await prisma.course.findMany({
    include: {
      instructor: {
        select: {
          name: true,
          avatar: true,
        },
      },
    },
  }) as Course[];

  const matchingCourses = allCourses.filter((course: Course) => {
    try {
      const courseTags = JSON.parse(course.tags);
      return assessmentData.goals.areasOfInterest.some(
        interest => courseTags.includes(interest)
      );
    } catch {
      return false;
    }
  });

  return matchingCourses.slice(0, 5);
}

export async function getUserCourseProgress(userId: string, courseId: string) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { 
        courseProgress: true 
      }
    });

    if (!profile?.courseProgress) return null;

    const allProgress = JSON.parse(profile.courseProgress);
    return allProgress[courseId] || null;
  } catch (error) {
    console.error('Failed to get course progress:', error);
    return null;
  }
}

export async function saveCourseProgress(userId: string, courseId: string, progress: any) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { courseProgress: true }
    });

    const allProgress = profile?.courseProgress 
      ? JSON.parse(profile.courseProgress)
      : {};

    await prisma.profile.update({
      where: { userId },
      data: {
        courseProgress: JSON.stringify({
          ...allProgress,
          [courseId]: progress
        })
      }
    });
  } catch (error) {
    console.error('Failed to save course progress:', error);
  }
}
