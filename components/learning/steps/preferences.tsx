'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AssessmentData, LearningStyle, StudyPace, GroupPreference } from '@/types/learning';

const LEARNING_STYLES: Array<{ value: LearningStyle; label: string; description: string }> = [
  {
    value: 'visual',
    label: 'Visual Learning',
    description: 'Learn best through images, diagrams, and visual content'
  },
  {
    value: 'auditory',
    label: 'Auditory Learning',
    description: 'Learn best through listening and discussion'
  },
  {
    value: 'reading',
    label: 'Reading/Writing',
    description: 'Learn best through reading and taking notes'
  },
  {
    value: 'kinesthetic',
    label: 'Hands-on Learning',
    description: 'Learn best through practical activities and exercises'
  }
];

interface PreferencesStepProps {
  data?: AssessmentData['preferences'];
  onBack: () => void;
  onNext: (preferences: AssessmentData['preferences']) => void;
}

export function PreferencesStep({ data, onBack, onNext }: PreferencesStepProps) {
  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        onNext({
          learningStyles: formData.getAll('learningStyle') as LearningStyle[],
          studyTime: {
            preferredHours: [
              parseInt(formData.get('studyStartHour') as string),
              parseInt(formData.get('studyEndHour') as string)
            ],
            daysPerWeek: parseInt(formData.get('daysPerWeek') as string)
          },
          pacePreference: formData.get('pace') as StudyPace,
          groupPreference: formData.get('group') as GroupPreference
        });
      }} 
      className="space-y-8"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Learning Style Preferences</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LEARNING_STYLES.map((style) => (
              <Card key={style.value} className="p-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="learningStyle"
                    value={style.value}
                    defaultChecked={data?.learningStyles?.includes(style.value)}
                    className="mt-1"
                  />
                  <div>
                    <Label>{style.label}</Label>
                    <p className="text-sm text-muted-foreground">{style.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Study Time Preference</Label>
          <Select 
            name="daysPerWeek" 
            defaultValue={String(data?.studyTime?.daysPerWeek || "5")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Days per week" />
            </SelectTrigger>
            <SelectContent>
              {[3,4,5,6,7].map((days) => (
                <SelectItem key={days} value={String(days)}>
                  {days} days per week
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Learning Pace</Label>
          <RadioGroup 
            name="pace" 
            defaultValue={data?.pacePreference || 'self-paced'}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="self-paced" id="self-paced" />
              <Label htmlFor="self-paced">Self-paced</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="structured" id="structured" />
              <Label htmlFor="structured">Structured schedule</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Group Learning Preference</Label>
          <RadioGroup 
            name="group" 
            defaultValue={data?.groupPreference || 'individual'}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individual" id="individual" />
              <Label htmlFor="individual">Individual learning</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="group" id="group" />
              <Label htmlFor="group">Group learning</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mixed" id="mixed" />
              <Label htmlFor="mixed">Mixed</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">
          Next
        </Button>
      </div>
    </form>
  );
}
