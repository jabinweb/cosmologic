'use client';

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, RotateCcw, MonitorPlay } from "lucide-react";
import { PLAYGROUND_CONFIG } from "@/config/playground-config";

interface PlaygroundControlsProps {
  language: string;
  onLanguageChange: (language: string) => void;
  onExampleChange: (code: string) => void;
  onRun: () => void;
  onReset: () => void;
}

export function PlaygroundControls({
  language,
  onLanguageChange,
  onExampleChange,
  onRun,
  onReset
}: PlaygroundControlsProps) {
  const currentLang = PLAYGROUND_CONFIG.languages[language];

  return (
    <div className="flex items-center gap-4">
      <Select defaultValue={language} onValueChange={onLanguageChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(PLAYGROUND_CONFIG.languages).map((lang) => (
            <SelectItem key={lang.id} value={lang.id}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        onValueChange={(value) => {
          const example = currentLang.examples.find(ex => ex.name === value);
          if (example) onExampleChange(example.code);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select example" />
        </SelectTrigger>
        <SelectContent>
          {currentLang.examples.map((example) => (
            <SelectItem key={example.name} value={example.name}>
              {example.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        {language !== 'html' && (
          <Button onClick={onRun} variant="default">
            <Play className="h-4 w-4 mr-2" />
            Run
          </Button>
        )}
        <Button onClick={onReset} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
}
