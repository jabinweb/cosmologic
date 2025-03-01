import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ProfileTabsProps {
  profile: any; // Replace with proper type
  defaultTab?: string;
  className?: string;
}

export function ProfileTabs({ profile, defaultTab = "activity", className }: ProfileTabsProps) {
  return (
    <Tabs defaultValue={defaultTab} className={cn("mt-6", className)}>
      <TabsList>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="courses">Courses</TabsTrigger>
        <TabsTrigger value="achievements">Achievements</TabsTrigger>
      </TabsList>
      <TabsContent value="activity" className="mt-6">
        {/* ProfileActivity component will be rendered here */}
      </TabsContent>
      <TabsContent value="courses">
        {/* Courses content */}
      </TabsContent>
      <TabsContent value="achievements">
        {profile.achievements?.length > 0 ? (
          <div className="grid gap-4">
            {profile.achievements.map((achievement: string) => (
              <div key={achievement} className="p-4 bg-muted rounded-lg">
                {achievement}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No achievements yet</p>
        )}
      </TabsContent>
    </Tabs>
  );
}
