"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "@/hooks/use-toast";
import { CouponInput } from "./coupon-input";
import { PlanType } from "@/types";

const checkoutFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{9,11}$/, "Invalid phone number"),
});

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

interface CheckoutFormProps {
  planId: PlanType;
  amount: number;
  onApplyDiscount: (discount: number) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function CheckoutForm({ planId, amount, onApplyDiscount }: CheckoutFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(0);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
    },
  });

  const verifyPayment = async (paymentId: string, orderId: string, signature: string) => {
    try {
      const res = await fetch('/api/checkout/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId,
          orderId,
          signature,
        }),
      });

      if (!res.ok) throw new Error('Payment verification failed');
      return await res.json();
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw error;
    }
  };

  const handleSubmit = async (data: CheckoutFormData) => {
    setLoading(true);

    try {
      // Create checkout session
      const sessionRes = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          amount,
          userData: data,
        }),
      });

      if (!sessionRes.ok) throw new Error('Failed to create checkout session');
      const session = await sessionRes.json();

      // Initialize Razorpay
      const razorpay = new window.Razorpay({
        key: session.key,
        order_id: session.orderId,
        amount: session.amount,
        currency: session.currency,
        name: "Cosmologic Academy",
        description: `${planId} Plan`,
        prefill: {
          name: data.name,
          email: data.email,
          contact: data.phone,
        },
        handler: async function(response: any) {
          try {
            // Verify payment immediately after success
            await verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );
            
            // Redirect to success page
            router.push(`/checkout/success?orderId=${session.orderId}`);
          } catch (error) {
            toast({
              title: "Error",
              description: "Payment verification failed",
              variant: "destructive",
            });
            router.push('/support?issue=payment');
          }
        },
      });

      razorpay.open();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate checkout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Your phone number" {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Have a coupon?</FormLabel>
          <CouponInput onApply={(value) => {
            setDiscount(value);
            onApplyDiscount(value);
          }} />
          {discount > 0 && (
            <p className="text-sm text-green-600">
              {discount}% discount will be applied
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Proceed to Payment"
          )}
        </Button>
      </form>
    </Form>
  );
}
