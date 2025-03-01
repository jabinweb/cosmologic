'use client';

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: any;
  onClick: () => void;
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <Card 
      className={cn(
        "p-4 hover:shadow-lg transition-all cursor-pointer",
        "transform hover:-translate-y-1 duration-200"
      )}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <Badge variant={course.level === 'beginner' ? 'default' : 'secondary'}>
            {course.level}
          </Badge>
          <Building2 className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <h3 className="font-semibold mb-2">{course.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 flex-grow">
          {course.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {course.tags.map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
