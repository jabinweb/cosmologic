"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { PlanType } from "@/types";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") as PlanType;
  const [planPrice, setPlanPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState<number>(0);

  useEffect(() => {
    async function fetchPlanPrice() {
      try {
        const res = await fetch(`/api/plans/${planId}`);
        const data = await res.json();
        setPlanPrice(data.plan.price);
      } catch (error) {
        console.error('Failed to fetch plan price:', error);
      } finally {
        setLoading(false);
      }
    }

    if (planId) {
      fetchPlanPrice();
    }
  }, [planId]);

  if (!planId || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CheckoutForm 
            planId={planId}
            amount={finalTotal}  
            onApplyDiscount={setDiscount}
          />
          <OrderSummary 
            planId={planId}
            planPrice={planPrice}
            discount={discount}
            onTotalChange={setFinalTotal}
          />
        </div>
      </div>
    </div>
  );
}
