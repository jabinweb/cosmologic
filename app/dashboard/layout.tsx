'use client';

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SubscriptionInfo } from "@/components/dashboard/subscription-info";
import { useSubscription } from '@/providers/subscription-provider';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSubscribed, isLoading } = useSubscription();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Subscription Required</h1>
          <p className="text-muted-foreground mb-6">
            Please subscribe to access the dashboard.
          </p>
          <Link href="/pricing">
            <Button>View Plans</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex">
        <div className="w-64 shrink-0 border-r bg-white dark:bg-gray-800 min-h-screen hidden lg:block">
          <DashboardSidebar />
        </div>
        <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              {children}
            </div>
            <div>
              <SubscriptionInfo />
            </div>
          </div>
        </main>
      </div>
      <div className="lg:hidden fixed top-0 left-0">
        <DashboardSidebar />
      </div>
    </div>
  );
}
