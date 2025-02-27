import { HeroSection } from "@/components/sections/hero";
import { FeaturesSection } from "@/components/sections/features";
import { ClassesSection } from "@/components/sections/classes";
import { CTASection } from "@/components/sections/cta";

export default function Home() {
  return (
    <main className="overflow-hidden">
      {/* Hero Section with space theme */}
      <div className="bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900">
        <HeroSection />
      </div>

      {/* Features Section with fun background */}
      <div className="relative">
        <div className="bg-white">
          <FeaturesSection />
        </div>
      </div>

      {/* Classes Section with light purple background */}
      <div className="relative bg-purple-50">
        <ClassesSection />
      </div>

      {/* CTA Section */}
      <CTASection />
    </main>
  );
}