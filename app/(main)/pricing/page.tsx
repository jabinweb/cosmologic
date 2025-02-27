import { PricingSection } from "@/components/sections/pricing";

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your learning journey
          </p>
        </div>
        <PricingSection />
      </div>
    </div>
  );
}
