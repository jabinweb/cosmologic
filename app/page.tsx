import { HeroSection } from "@/components/sections/hero";
import { WhyUsSection } from "@/components/sections/why-us";
import { ClassesSection } from "@/components/sections/classes";
import { PricingSection } from "@/components/sections/pricing";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="pt-16">
      <HeroSection />
      <section id="why-us">
        <WhyUsSection />
      </section>
      <ClassesSection />
      <section id="courses">
        <PricingSection />
      </section>
      <section id="contact">
        <Footer />
      </section>
    </main>
  );
}