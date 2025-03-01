'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AssessmentData } from '@/types/learning';

const GRADE_LEVELS = [
  { value: 6, label: '6th Grade' },
  { value: 7, label: '7th Grade' },
  { value: 8, label: '8th Grade' },
  { value: 9, label: '9th Grade' },
  { value: 10, label: '10th Grade' },
  { value: 11, label: '11th Grade' },
  { value: 12, label: '12th Grade' },
];

const LANGUAGES = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
];

const DEVICES = [
  { value: 'computer', label: 'Computer/Laptop' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'smartphone', label: 'Smartphone' },
];

export function BasicInfoStep({ data, onNext }: { 
  data?: AssessmentData['basicInfo'],
  onNext: (data: AssessmentData['basicInfo']) => void
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    onNext({
      gradeLevel: parseInt(formData.get('gradeLevel') as string),
      age: parseInt(formData.get('age') as string),
      previousEducation: formData.get('previousEducation') as string,
      languagePreference: formData.getAll('language') as string[],
      deviceAccess: formData.getAll('device') as string[],
      internetConnection: formData.get('internet') as 'stable' | 'unstable',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Tell us about yourself</h2>
          <p className="text-muted-foreground">
            This helps us personalize your learning experience
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Grade Level</Label>
              <Select name="gradeLevel" defaultValue={String(data?.gradeLevel)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your grade" />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_LEVELS.map((grade) => (
                    <SelectItem key={grade.value} value={String(grade.value)}>
                      {grade.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Age</Label>
              <Input 
                type="number" 
                name="age" 
                defaultValue={data?.age}
                min={10}
                max={28}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Current School/Institution</Label>
            <Input 
              name="previousEducation"
              placeholder="Name of your school"
              defaultValue={data?.previousEducation}
            />
          </div>

          <div className="space-y-2"></div>
            <Label>Preferred Learning Languages</Label>
            <div className="grid grid-cols-2 gap-4">
              {LANGUAGES.map((lang) => (
                <div key={lang.value} className="flex items-center space-x-2">
                  <Checkbox 
                    name="language" 
                    value={lang.value}
                    defaultChecked={data?.languagePreference?.includes(lang.value)}
                  />
                  <Label>{lang.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Available Devices for Learning</Label>
            <div className="grid grid-cols-2 gap-4">
              {DEVICES.map((device) => (
                <div key={device.value} className="flex items-center space-x-2">
                  <Checkbox 
                    name="device" 
                    value={device.value}
                    defaultChecked={data?.deviceAccess?.includes(device.value)}
                  />
                  <Label>{device.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Internet Connection</Label>
            <Select 
              name="internet"
              defaultValue={data?.internetConnection}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select connection type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stable">Stable (Broadband/Fiber)</SelectItem>
                <SelectItem value="unstable">Limited/Mobile Data</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      <Button type="submit" className="mt-8">Next</Button>
    </form>
  );
}
