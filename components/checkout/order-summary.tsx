"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanType } from "@/types";
import { Shield, Clock, CheckCircle } from "lucide-react";
import Script from "next/script";
import { useEffect } from "react";

interface OrderSummaryProps {
  planId: PlanType;
  planPrice: number;
  discount?: number;
  onTotalChange?: (total: number) => void;  // Add this prop
}

export function OrderSummary({ planId, planPrice, discount = 0, onTotalChange }: OrderSummaryProps) {
  const subtotal = planPrice;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;
  const gst = total * 0.18; // 18% GST
  const finalTotal = total + gst;

  // Notify parent component when total changes
  useEffect(() => {
    onTotalChange?.(finalTotal);
  }, [finalTotal, onTotalChange]);

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Order Summary</span>
            <span className="text-sm text-muted-foreground capitalize">
              {planId} Plan
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Base Price</span>
              <span>₹{(subtotal / 100).toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Discount ({discount}%)</span>
                <span className="text-green-600">-₹{(discountAmount / 100).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{(total / 100).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">GST (18%)</span>
              <span>₹{(gst / 100).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total Amount</span>
              <span>₹{(finalTotal / 100).toLocaleString()}</span>
            </div>
          </div>

          {/* Plan Benefits */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-medium">Plan Includes:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Unlimited access to {planId} classes</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Monthly subscription - Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-500" />
                <span>100% Secure Payment</span>
              </div>
            </div>
          </div>

          {/* Payment Security Note */}
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Secured by Razorpay 🔒 | All prices are in INR and include GST
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
