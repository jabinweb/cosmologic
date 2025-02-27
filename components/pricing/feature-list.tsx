import { Check, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Feature } from "@/types";

type PlanFeatures = "basic" | "pro" | "premium";

export const planFeatures: Record<PlanFeatures, Feature[]> = {
  basic: [
    { name: "Access to basic courses", included: true },
    { name: "Community support", included: true },
    { name: "Online projects", included: true },
    { name: "Progress tracking", included: true },
    { name: "Virtual coding challenges", included: false },
    { name: "Online mentoring", included: false },
  ],
  pro: [
    { name: "Access to all online courses", included: true },
    { name: "Priority online support", included: true },
    { name: "Advanced online projects", included: true },
    { name: "Detailed analytics", included: true },
    { name: "Virtual coding challenges", included: true, tooltip: "Monthly challenges" },
    { name: "2hrs/month online mentoring", included: true },
  ],
  premium: [
    { name: "All online courses", included: true },
    { name: "24/7 online support", included: true },
    { name: "Expert online projects", included: true },
    { name: "Advanced analytics", included: true },
    { name: "Weekly coding challenges", included: true },
    { name: "Unlimited online mentoring", included: true },
    { name: "Virtual career guidance", included: true },
  ],
};

interface FeatureListProps {
  features: Feature[];
}

export function FeatureList({ features }: FeatureListProps) {
  return (
    <TooltipProvider>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li
            key={index}
            className={`flex items-center ${
              !feature.included && "text-muted-foreground"
            }`}
          >
            <Check
              className={`h-4 w-4 mr-2 ${
                feature.included ? "text-green-500" : "text-gray-300"
              }`}
            />
            <span className="flex-1">{feature.name}</span>
            {feature.tooltip && (
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>{feature.tooltip}</TooltipContent>
              </Tooltip>
            )}
          </li>
        ))}
      </ul>
    </TooltipProvider>
  );
}
