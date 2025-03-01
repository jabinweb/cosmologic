'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AssessmentData } from '@/types/learning';

const INTEREST_AREAS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Computer Science', 'Literature', 'History', 'Art',
  'Music', 'Engineering', 'Economics', 'Psychology'
];

export function GoalsStep({
  data,
  onBack,
  onComplete,
  loading
}: {
  data?: AssessmentData['goals'];
  onBack: () => void;
  onComplete: (data: AssessmentData['goals']) => void;
  loading: boolean;
}) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    data?.areasOfInterest || []
  );

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Learning Goals</h2>
        <p className="text-muted-foreground">Tell us about your learning objectives</p>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        onComplete({
          immediateGoals: [formData.get('immediateGoal') as string],
          longTermGoals: [formData.get('longTermGoal') as string],
          areasOfInterest: selectedInterests,
          careerAspirations: [formData.get('career') as string],
          certificationsDesired: formData.get('certifications') === 'on'
        });
      }} className="space-y-6">
        {/* Form fields */}
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label>What do you want to achieve in the next 3 months?</Label>
            <Input 
              name="immediateGoal" 
              placeholder="e.g., Master basic calculus"
              defaultValue={data?.immediateGoals?.[0]}
            />
          </div>

          <div className="space-y-2">
            <Label>What is your long-term learning goal?</Label>
            <Input 
              name="longTermGoal"
              placeholder="e.g., Become a data scientist"
              defaultValue={data?.longTermGoals?.[0]}
            />
          </div>

          <div className="space-y-4">
            <Label>Areas of Interest</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {INTEREST_AREAS.map((area) => (
                <Button
                  key={area}
                  type="button"
                  variant={selectedInterests.includes(area) ? "default" : "outline"}
                  onClick={() => {
                    setSelectedInterests(prev => 
                      prev.includes(area) 
                        ? prev.filter(i => i !== area)
                        : [...prev, area]
                    );
                  }}
                  className="justify-start"
                >
                  {area}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Complete"}
          </Button>
        </div>
      </form>
    </div>
  );
}
