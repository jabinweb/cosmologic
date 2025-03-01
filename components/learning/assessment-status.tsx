'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { AssessmentStatus } from '@/types/learning';

interface AssessmentStatusProps {
  status: AssessmentStatus;
}

export function AssessmentStatusView({ status }: AssessmentStatusProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const canReassess = new Date(status.nextAvailable) <= new Date();

  const handleReassessment = () => {
    if (canReassess) {
      setIsLoading(true);
      router.push('/learning/assessment?type=reassessment');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Learning Assessment</h3>
        <span className="text-sm text-muted-foreground">
          Attempt {status.attempts}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          Last assessed: {formatDistanceToNow(new Date(status.lastCompleted))} ago
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleReassessment}
            disabled={!canReassess || isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {canReassess ? 'Take Reassessment' : 
              `Reassessment available in ${formatDistanceToNow(new Date(status.nextAvailable))}`
            }
          </Button>
        </div>
      </div>
    </Card>
  );
}
