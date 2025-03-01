'use client';

import { Card } from '@/components/ui/card';
import { Trophy, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
}

interface AchievementsProps {
  achievements: Achievement[];
  unlockedAchievements: string[];
}

export function Achievements({ achievements, unlockedAchievements }: AchievementsProps) {
  // Ensure each achievement has a unique ID
  const validAchievements = achievements.filter(a => a.id);

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center">
        <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
        Achievements
      </h3>
      <div className="space-y-3">
        {validAchievements.map((achievement) => {
          const id = achievement.id || String(achievement.name);
          const isUnlocked = unlockedAchievements.includes(id);
          
          return (
            <div
              key={id}
              className={cn(
                "p-3 rounded-lg border",
                isUnlocked ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{achievement.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                  {isUnlocked && (
                    <span className="text-xs text-green-600 mt-1">
                      +{achievement.points} points
                    </span>
                  )}
                </div>
                {!isUnlocked && <Lock className="h-4 w-4 text-muted-foreground" />}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
