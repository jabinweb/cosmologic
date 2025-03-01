'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface VideoProps {
  data: {
    videoUrl: string;
    duration: number;
    checkpoints: {
      time: number;
      question: string;
      answers: string[];
      correctAnswer: number;
    }[];
  };
  onComplete: (points: number) => void;
}

export function Video({ data, onComplete }: VideoProps) {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCheckpoint, setCurrentCheckpoint] = useState<number | null>(null);

  const handleTimeUpdate = (time: number) => {
    const progressPercent = (time / data.duration) * 100;
    setProgress(progressPercent);

    // Check for checkpoints
    const checkpoint = data.checkpoints.find(cp => 
      Math.abs(cp.time - time) < 0.5 && cp.time > (currentCheckpoint ?? -1)
    );

    if (checkpoint) {
      setIsPlaying(false);
      setCurrentCheckpoint(checkpoint.time);
    }

    if (progressPercent >= 95) {
      onComplete(100);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="aspect-video relative overflow-hidden">
        {/* Video player implementation */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60">
          <Progress value={progress} className="mb-2" />
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-white"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <span className="text-white text-sm">
              {formatTime(progress * data.duration / 100)} / {formatTime(data.duration)}
            </span>
          </div>
        </div>
      </Card>

      {currentCheckpoint !== null && (
        <Card className="p-4">
          {/* Checkpoint question UI */}
        </Card>
      )}
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
