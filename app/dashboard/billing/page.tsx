"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Clock, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface BillingData {
  subscription: {
    id: string;
    planId: string;
    status: string;
    amount: number;
    activatedAt: string;
    expiresAt: string;
    paymentId: string;
  };
  paymentHistory: Array<{
    id: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

function ViewInvoiceButton({ subscriptionId }: { subscriptionId: string }) {
  const handleClick = () => {
    window.open(`/api/subscriptions/${subscriptionId}/invoice`, '_blank');
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleClick}
      className="text-blue-600 hover:text-blue-800"
    >
      <FileText className="h-4 w-4 mr-2" />
      View Invoice
    </Button>
  );
}

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<BillingData | null>(null);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const res = await fetch('/api/billing/details');
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Failed to fetch billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data?.subscription) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Billing</h1>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No active subscription found. Subscribe to access premium features.
          </AlertDescription>
        </Alert>
        <Button asChild>
          <a href="/pricing">View Plans</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Billing</h1>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Manage your subscription and billing details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold capitalize">{data.subscription.planId} Plan</h3>
            </div>
            <Badge variant={data.subscription.status === 'ACTIVE' ? 'default' : 'secondary'}>
              {data.subscription.status.toLowerCase()}
            </Badge>
          </div>

          <div className="grid gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span>₹{(data.subscription.amount / 100).toFixed(2)}/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Next Payment</span>
              <span>{formatDate(data.subscription.expiresAt)}</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => window.location.href = '/pricing'}>
              Change Plan
            </Button>
            <Button variant="destructive">Cancel Subscription</Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Your recent payments and invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.paymentHistory.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    payment.status === 'success' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    {payment.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">₹{(payment.amount / 100).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(payment.createdAt)}
                    </p>
                  </div>
                </div>
                <ViewInvoiceButton subscriptionId={data.subscription.id} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
