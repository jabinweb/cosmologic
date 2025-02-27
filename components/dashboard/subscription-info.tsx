"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2, Crown, Calendar, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface SubscriptionData {
  status: string;
  planId: string;
  activatedAt: string;
  expiresAt: string;
}

export function SubscriptionInfo() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const res = await fetch('/api/subscription/current');
        const data = await res.json();
        setSubscription(data.subscription);
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Loading subscription info...</p>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center mb-4">
            <AlertCircle className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
            <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to access premium features and content
            </p>
          </div>
          <Button 
            className="w-full" 
            onClick={() => router.push('/pricing')}
          >
            View Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          {subscription.planId} Plan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status</span>
            <span className="capitalize font-medium">
              {subscription.status.toLowerCase()}
            </span>
          </div>        

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Activated</span>
            <span className="font-medium">
              {subscription?.activatedAt ? formatDate(subscription.activatedAt) : 'Not activated'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Next Payment</span>
            <span className="font-medium">
              {subscription?.expiresAt ? formatDate(subscription.expiresAt) : 'N/A'}
            </span>
          </div>

          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => router.push('/dashboard/billing')}
          >
            Manage Subscription
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
