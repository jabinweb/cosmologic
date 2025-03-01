'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

interface ModuleCompletionActivityProps {
  activity: {
    type: 'quiz' | 'challenge';
    title: string;
    description: string;
    points: number;
    content: any;
  };
  onComplete: (score: number) => void;
}

export function ModuleCompletionActivity({ activity, onComplete }: ModuleCompletionActivityProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleComplete = () => {
    const correctAnswers = activity.content.questions.filter(
      (q: any, i: number) => q.correctAnswer === answers[i]
    ).length;
    const score = (correctAnswers / activity.content.questions.length) * 100;
    onComplete(score);
  };

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <Trophy className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
        <h3 className="text-xl font-bold">{activity.title}</h3>
        <p className="text-muted-foreground">{activity.description}</p>
      </div>

      {/* Add quiz/challenge content rendering here */}
    </Card>
  );
}
