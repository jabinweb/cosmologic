"use client";

import { motion } from "framer-motion";
import { MathSection } from "@/components/subjects/math-section";
import { ComputerSection } from "@/components/subjects/computer-section";
import { ScienceSection } from "@/components/subjects/science-section";
import { FloatingElement } from "@/components/ui/floating-element";

export function ClassesSection() {
  const backgroundEmojis = ['🚀', '⭐', '🎮', '🔬', '🧮', '💻'];

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {backgroundEmojis.map((emoji, i) => (
          <FloatingElement
            key={i}
            delay={i * 0.5}
            duration={4}
            className="absolute text-4xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            {emoji}
          </FloatingElement>
        ))}
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Explore Amazing Subjects!</span> 🌟
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our fun learning adventure with interactive lessons and games!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          <ComputerSection />
          <MathSection />
          <ScienceSection />
        </div>
      </div>
    </section>
  );
}