'use client';

import { useState } from 'react';
import { BasicInfoStep } from './steps/basic-info';
import { PreferencesStep } from '@/components/learning/steps/preferences';
import { GoalsStep } from './steps/goals';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { saveAssessment } from '@/lib/actions/learning';
import { AssessmentData } from '@/types/learning';
import { toast } from '@/hooks/use-toast';

interface AssessmentFormProps {
  userId: string;
  isReassessment?: boolean;
}

export function AssessmentForm({ userId, isReassessment = false }: AssessmentFormProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<AssessmentData>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleComplete = async (goals: AssessmentData['goals']) => {
    setLoading(true);
    try {
      const completeData = {
        ...data,
        goals
      } as AssessmentData;

      // Wait for the assessment to be saved
      await saveAssessment(userId, completeData);
      
      // Add a small delay to ensure DB update is complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use window.location for a full page refresh
      window.location.href = '/learning/hub';
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {isReassessment && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-blue-700">
            This is a reassessment. Your previous learning data will be preserved.
          </p>
        </div>
      )}
      <Progress value={(step / 3) * 100} />
      
      {step === 1 && (
        <BasicInfoStep 
          data={data.basicInfo} 
          onNext={(basicInfo) => {
            setData({ ...data, basicInfo });
            setStep(2);
          }} 
        />
      )}

      {step === 2 && (
        <PreferencesStep 
          data={data.preferences}
          onBack={() => setStep(1)}
          onNext={(preferences) => {
            setData({ ...data, preferences });
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <GoalsStep
          data={data.goals}
          onBack={() => setStep(2)}
          onComplete={(goals) => {
            setData({ ...data, goals });
            handleComplete(goals);
          }}
          loading={loading}
        />
      )}
    </div>
  );
}
