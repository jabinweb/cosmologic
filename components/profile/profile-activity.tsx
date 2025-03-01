'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistance } from "date-fns";
import Link from "next/link";

interface ProfileActivityProps {
  userId: string;
}

export function ProfileActivity({ userId }: ProfileActivityProps) {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const res = await fetch(`/api/users/${userId}/activity`);
        const data = await res.json();
        setActivities(data.activities);
      } catch (error) {
        console.error('Error fetching activity:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
  }, [userId]);

  if (loading) {
    return <div>Loading activity...</div>;
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id} className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={activity.user.avatar} />
              <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Link href={`/forums/${activity.topic.forum.slug}/${activity.topic.id}`} className="font-medium hover:underline">
                  {activity.title}
                </Link>
                <span className="text-sm text-muted-foreground">
                  {formatDistance(new Date(activity.createdAt), new Date(), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{activity.content}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
