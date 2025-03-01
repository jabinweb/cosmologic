export type PlanType = "basic" | "pro" | "premium";

export interface Feature {
  name: string;
  included: boolean;
  tooltip?: string;
}

export interface RazorpayPlan {
  id: string;
  amount: number;
  currency: string;
  interval: string;
  name: string;
}

export interface Plan {
  id: string;
  type: PlanType;
  name: string;
  displayName: string;
  description: string;
  price: number;
  features: string[];
  perks: string[];
  isFeatured: boolean;
  isActive: boolean;
  color: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  icon?: any; // for the plan icon component
  popular?: boolean; // for backward compatibility
}

export interface EditPlanFormData {
  id?: string;
  type: Plan['type'];
  name: string;
  displayName: string;
  description: string;
  price: number;
  features: string[];
  perks: string[];
  isFeatured: boolean;
  isActive: boolean;
  color: string;
  order: number;
}

export interface PlanFeatures {
  basic: Feature[];
  pro: Feature[];
  premium: Feature[];
}

export interface RazorpayPlans {
  [key: string]: RazorpayPlan;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  emailVerified?: Date;
  profile?: {
    id: string;
    bio?: string;
    assessmentCompleted?: boolean;
    assessmentData?: string;
    achievements: string;
    skills: string;
    socialLinks: string;
  };
}
