'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

interface ConceptProps {
  data: {
    title: string;
    description: string;
    content: {
      explanation: string;
      examples: string[];
      interactiveElements: Array<{
        type: string;
        question: string;
        options: string[];
        correctAnswer: string | number;
      }>;
    };
  };
  onComplete: (points: number) => void;
}

export function Concept({ data, onComplete }: ConceptProps) {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const steps = [
    { type: 'explanation', content: data.content.explanation },
    ...data.content.examples.map(ex => ({ type: 'example', content: ex })),
    ...data.content.interactiveElements
  ];

  const progress = (completed.size / steps.length) * 100;

  const handleComplete = () => {
    if (progress === 100) {
      onComplete(100);
    }
  };

  return (
    <div className="space-y-4">
      <Progress value={progress} className="mb-4" />
      
      <Card className="p-6">
        <div className="prose dark:prose-invert max-w-none">
          {step === 0 && <div dangerouslySetInnerHTML={{ __html: data.content.explanation }} />}
          {step > 0 && step <= data.content.examples.length && (
            <div>
              <h4>Example {step}</h4>
              <p>{data.content.examples[step - 1]}</p>
            </div>
          )}
          {step > data.content.examples.length && (
            <div className="space-y-4">
              <h4>Practice Question</h4>
              {/* Interactive element rendering based on type */}
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => setStep(s => s - 1)}
          disabled={step === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={() => {
            completed.add(step);
            setCompleted(new Set(completed));
            if (step < steps.length - 1) {
              setStep(s => s + 1);
            } else {
              handleComplete();
            }
          }}
        >
          {step === steps.length - 1 ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete
            </>
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
