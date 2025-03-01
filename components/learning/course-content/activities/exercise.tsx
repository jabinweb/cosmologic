'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Check, Code, RefreshCcw } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ExerciseProps {
  data: {
    prompt: string;
    hints: string[];
    expectedOutput?: string;
    testCases?: { input: string; output: string }[];
  };
  onComplete: (points: number) => void;
}

export function Exercise({ data, onComplete }: ExerciseProps) {
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const checkSolution = async () => {
    setIsChecking(true);
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    try {
      const result = await model.generateContent(`
        Evaluate this solution:
        Problem: ${data.prompt}
        Solution: ${code}
        ${data.expectedOutput ? `Expected Output: ${data.expectedOutput}` : ''}
        
        Provide feedback and a score from 0-100. Format as JSON:
        { "feedback": "string", "score": number }
      `);

      const evaluation = JSON.parse(result.response.text());
      setFeedback(evaluation.feedback);
      onComplete(evaluation.score);
    } catch (error) {
      setFeedback('Error evaluating solution. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <p className="text-sm mb-4">{data.prompt}</p>
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="font-mono min-h-[200px]"
          placeholder="Write your solution here..."
        />
      </Card>

      <div className="flex justify-between items-start">
        <div className="space-y-2">
          {data.hints.map((hint, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              💡 Hint {index + 1}: {hint}
            </p>
          ))}
        </div>
        <Button
          onClick={checkSolution}
          disabled={isChecking || !code.trim()}
        >
          {isChecking ? (
            <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Check className="h-4 w-4 mr-2" />
          )}
          Check Solution
        </Button>
      </div>

      {feedback && (
        <Card className="p-4 bg-muted">
          <p className="text-sm">{feedback}</p>
        </Card>
      )}
    </div>
  );
}
