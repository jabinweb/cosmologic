'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Code, Check, RefreshCcw } from 'lucide-react';
import { evaluateProject } from '@/lib/course-ai';

interface ProjectProps {
  data: {
    title: string;
    description: string;
    requirements: string[];
    resources: { name: string; url: string }[];
    rubric: { criterion: string; points: number }[];
  };
  onComplete: (points: number) => void;
}

export function Project({ data, onComplete }: ProjectProps) {
  const [activeTab, setActiveTab] = useState('instructions');
  const [submission, setSubmission] = useState({ code: '', explanation: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const evaluation = await evaluateProject(data, submission);
      onComplete(evaluation.score);
    } catch (error) {
      console.error('Project evaluation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="rubric">Rubric</TabsTrigger>
        </TabsList>

        <TabsContent value="instructions" className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-2">{data.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {data.description}
            </p>
            <div className="space-y-2">
              {data.requirements.map((req, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs">
                    {i + 1}
                  </div>
                  <p className="text-sm">{req}</p>
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-4">
            <h4 className="font-semibold mb-2">Resources</h4>
            <div className="space-y-2">
              {data.resources.map((resource, i) => (
                <a
                  key={i}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline block"
                >
                  {resource.name}
                </a>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="workspace" className="space-y-4">
          {/* Project workspace implementation */}
          <Card className="p-4">
            <Textarea
              placeholder="Write your code here..."
              className="font-mono mb-4"
              value={submission.code}
              onChange={(e) => setSubmission(prev => ({ ...prev, code: e.target.value }))}
            />
            <Textarea
              placeholder="Explain your solution..."
              value={submission.explanation}
              onChange={(e) => setSubmission(prev => ({ ...prev, explanation: e.target.value }))}
            />
          </Card>
          
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !submission.code}
            className="w-full"
          >
            {isSubmitting ? (
              <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Submit Project
          </Button>
        </TabsContent>

        <TabsContent value="rubric">
          <Card className="p-4">
            <div className="space-y-3">
              {data.rubric.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm">{item.criterion}</span>
                  <span className="text-sm font-semibold">{item.points} pts</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
