import Razorpay from 'razorpay';
import { PlanType, RazorpayPlans, Plan } from '@/types';

export const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

export function mapDbPlansToRazorpay(plans: Plan[]): RazorpayPlans {
  const mappedPlans: RazorpayPlans = {};

  plans.forEach(plan => {
    mappedPlans[plan.name as PlanType] = {
      id: `plan_${plan.name}`,
      amount: plan.price,
      currency: 'INR',
      interval: 'monthly',
      name: plan.displayName
    };
  });

  return mappedPlans;
}

