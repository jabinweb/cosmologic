import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Module, CourseProgress } from '@/types/course';

interface ModuleListProps {
  modules: Module[];
  currentModuleId: string | null;
  onModuleSelect: (moduleId: string) => void;
  progress: CourseProgress;
}

export function ModuleList({ modules, currentModuleId, progress, onModuleSelect }: ModuleListProps) {
  const isModuleAccessible = (module: Module) => {
    if (module.order === 0) return true;
    const prevModule = modules.find(m => m.order === module.order - 1);
    return prevModule && progress.modules[prevModule.id]?.completed;
  };

  return (
    <Card className="p-4">
      <h2 className="font-semibold mb-4">Course Modules</h2>
      <div className="space-y-2">
        {modules.map((module) => {
          const isCompleted = progress.modules[module.id]?.completed;
          const isActive = currentModuleId === module.id;
          const isAccessible = isModuleAccessible(module);

          return (
            <div key={module.id} className="space-y-2">
              <Button
                variant={isCompleted ? "default" : isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isCompleted && "bg-green-600 hover:bg-green-700 text-white",
                  !isAccessible && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => isAccessible && onModuleSelect(module.id)}
                disabled={!isAccessible && !isCompleted}
              >
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4 mr-2" />
                ) : !isAccessible ? (
                  <Lock className="h-4 w-4 mr-2" />
                ) : (
                  <PlayCircle className="h-4 w-4 mr-2" />
                )}
                {module.title}
              </Button>

              {/* Show completion reward if module is completed */}
              {isCompleted && (
                <div className="ml-8 text-sm text-green-600">
                  +100 XP Earned!
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
