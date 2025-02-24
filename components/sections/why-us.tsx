"use client";

import { motion } from "framer-motion";
import { Users, Target, Rocket } from "lucide-react";

const features = [
  { icon: <Users className="w-12 h-12" />, title: "Expert Instructors" },
  { icon: <Target className="w-12 h-12" />, title: "Affordable Learning" },
  { icon: <Rocket className="w-12 h-12" />, title: "Hands-On Projects" }
];

export function WhyUsSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex justify-center mb-4 text-purple-600">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}