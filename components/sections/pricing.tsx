"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, HelpCircle, Loader2, AlertCircle, Sparkle, Rocket, Star } from "lucide-react";
import { CheckoutButton } from "@/components/checkout/checkout-button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plan, PlanFeatures, PlanType } from "@/types";
import { planFeatures } from "@/components/pricing/feature-list";
import { Feature } from "@/types";
import { defaultPlans } from "@/components/config/plans";

const planIcons = {
  basic: Sparkle,
  pro: Rocket,
  premium: Star
} as const;

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  const PlanIcon = planIcons[plan.name as keyof typeof planIcons] || Sparkle;
  
  const features = Array.isArray(plan.features) 
    ? plan.features 
    : JSON.parse(plan.features || '[]');
  
  const perks = Array.isArray(plan.perks)
    ? plan.perks
    : JSON.parse(plan.perks || '[]');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      <Card className={cn(
        "relative h-full transition-all duration-200 hover:shadow-lg",
        (plan.isFeatured) && "border-purple-500 shadow-purple-100 dark:shadow-purple-900/20"
      )}>
        {plan.isFeatured && (
          <div className="absolute -top-4 left-0 right-0 flex justify-center">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </span>
          </div>
        )}

        <CardHeader>
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-gradient-to-r",
            plan.name === 'basic' && "from-blue-500 to-cyan-500",
            plan.name === 'pro' && "from-purple-500 to-pink-500",
            plan.name === 'premium' && "from-amber-500 to-red-500"
          )}>
            <PlanIcon className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">{plan.displayName}</CardTitle>
          <CardDescription>{plan.description}</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">
              ₹{(plan.price / 100).toLocaleString()}
            </span>
            <span className="text-muted-foreground">/month</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Core Features */}
          <div className="space-y-2">
            {features.map((feature: string, i: number) => (
              <p key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                {feature}
              </p>
            ))}
          </div>

          {/* Plan Features */}
          <div className="space-y-2 pt-4 border-t">
            {(planFeatures[plan.name as keyof PlanFeatures] || []).map((feature: Feature, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm">{feature.name}</span>
                {feature.tooltip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>{feature.tooltip}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter>
          <CheckoutButton
            planId={plan.name as PlanType}
            amount={plan.price}
            razorpayPlans={{}}
            className={cn(
              "w-full bg-gradient-to-r",
              plan.name === 'basic' && "from-blue-500 to-cyan-500",
              plan.name === 'pro' && "from-purple-500 to-pink-500",
              plan.name === 'premium' && "from-amber-500 to-red-500"
            )}
          />
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export function PricingSection() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializePlans() {
      try {
        const res = await fetch('/api/plans');
        const data = await res.json();

        if (!data.plans || data.plans.length === 0) {
          const initRes = await fetch('/api/admin/plans', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              initial: true,
              plans: defaultPlans
            }),
          });
          
          if (!initRes.ok) throw new Error('Failed to create initial plans');
          const initData = await initRes.json();
          setPlans(initData.plans);
        } else {
          setPlans(data.plans);
        }
      } catch (error) {
        console.error('Failed to load plans:', error);
        setError('Failed to load pricing plans');
      } finally {
        setLoading(false);
      }
    }

    initializePlans();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-4">Loading pricing plans...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 text-center">
          <AlertCircle className="h-8 w-8 mx-auto text-red-500" />
          <p className="mt-4 text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {Array.isArray(plans) && plans.length > 0 ? (
            plans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                index={index}
              />
            ))
          ) : (
            <div className="md:col-span-3 text-center py-12">
              <p className="text-muted-foreground">No pricing plans available.</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mt-12"
        >
          <p className="text-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            First 10 Students Get 20% Off!
          </p>
          <p className="mt-2 text-muted-foreground">
            Need help choosing? Contact us: <a href="tel:+919170523331" className="text-purple-600 hover:text-purple-700">+91 9170523331</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}