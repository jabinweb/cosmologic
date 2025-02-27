"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <section className="pt-20 pb-16 bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-gray-900 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Learn to Code with Fun!</span> 🚀
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300">
              Join our space adventure and become a coding astronaut! 
              Perfect for young minds aged 8-16 years.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="text-lg rounded-full">
                Start Learning 🎮
              </Button>
              <Button size="lg" variant="outline" className="text-lg rounded-full">
                Watch Demo 🎥
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-4">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-purple-200 border-2 border-white" />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Join 1000+ happy students! 🌟
              </p>
            </div>
          </motion.div>
          <motion.div 
            className="flex-1 relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <motion.div animate={floatingAnimation}>
              <div className="relative w-full h-full">
                <Image
                  src="/images/hero-illustration.svg"
                  alt="Hero illustration"
                  width={800}
                  height={600}
                  priority
                  className="w-full h-auto object-contain"
                />
              </div>
            </motion.div>
            <div className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
              <p className="text-2xl">🏆</p>
              <p className="font-bold">Fun Learning</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Games & Projects
              </p>
            </div>
            <div className="absolute -top-8 -right-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
              <p className="text-2xl">🎯</p>
              <p className="font-bold">Easy to Follow</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Step by Step
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}