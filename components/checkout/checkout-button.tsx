"use client";

import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/components/auth/login-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { useSession } from '@/providers/session-provider';
import { PlanType, RazorpayPlans } from '@/types';

interface CheckoutButtonProps {
  planId: PlanType;
  amount: number;
  razorpayPlans: RazorpayPlans;
  className?: string;
  variant?: "default" | "outline" | "secondary";
}

export function CheckoutButton({ 
  planId, 
  razorpayPlans,
  className, 
  variant = "default" 
}: CheckoutButtonProps) {
  const { session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (status !== 'authenticated') return;
    setLoading(true);

    try {
      const planDetails = razorpayPlans.planId;
      
      if (!planDetails) {
        throw new Error('Invalid plan selected');
      }

      // Create checkout session with the current plan price
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: planId,
          amount: planDetails.amount,  // Using the mapped plan price
          currency: planDetails.currency
        }),
      });

      if (!res.ok) throw new Error('Failed to create checkout session');

      router.push(`/checkout?plan=${planId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout process",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <Button className={className} disabled>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </Button>;
  }

  if (status === 'unauthenticated') {
    return (
      <LoginDialog 
        mode="login" 
        trigger={
          <Button variant={variant} className={className}>
            Login to Subscribe
          </Button>
        } 
      />
    );
  }

  return (
    <Button
      variant={variant}
      className={className}
      onClick={handleCheckout}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait...
        </>
      ) : (
        "Subscribe Now"
      )}
    </Button>
  );
}
