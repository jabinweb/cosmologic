"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    title: "Live Online Classes",
    description: "Interactive sessions with expert instructors in real-time.",
    icon: "✨",
  },
  {
    title: "1:1 Mentoring",
    description: "Personal guidance and support from industry professionals.",
    icon: "👥",
  },
  {
    title: "Project-Based Learning",
    description: "Hands-on experience with real-world projects.",
    icon: "🚀",
  },
  {
    title: "Structured Curriculum",
    description: "Well-designed learning path for optimal progress.",
    icon: "📚",
  },
  {
    title: "Industry Insights",
    description: "Stay updated with the latest trends and technologies.",
    icon: "💡",
  },
  {
    title: "Community Support",
    description: "Learn and grow together with like-minded peers.",
    icon: "🤝",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-20">
      {/* Background with particles */}
      <div 
        className="absolute inset-0" 
        style={{ 
          background: 'linear-gradient(to bottom, #fafafa, #ffffff)',
          zIndex: 0 
        }}
      >
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative" style={{ zIndex: 1 }}>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Why Choose Cosmologic Academy?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Discover what makes our learning experience unique and effective
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 group p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white dark:hover:bg-gray-900">
                <div className="relative z-10">
                  <span className="text-4xl mb-4 block">{feature.icon}</span>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
                <div 
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ zIndex: 0 }}
                />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
