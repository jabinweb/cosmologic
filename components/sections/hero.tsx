"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { motion } from "framer-motion";
import { SolarSystem } from '@/components/solar-system';
import { useState } from 'react';
import { Atom } from '@/components/atom';

export function HeroSection() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'solar' | 'atom'>('solar');

  const handleStartLearning = () => {
    if (!user) {
      // If not logged in, redirect to login with callback
      router.push('/login?callbackUrl=/assessment');
      return;
    }

    // If logged in but no assessment, go to assessment
    if (!user.profile?.assessmentCompleted) {
      router.push('/assessment');
      return;
    }

    // If assessment completed, go to learning hub
    router.push('/learning/hub');
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <section className="pt-10 pb-16 bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-900 dark:to-pink-900 overflow-hidden">
      <div className="container mx-auto relative">
        {/* Floating elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-10 right-20 hidden lg:block"
        >
          <span className="text-4xl">🌟</span>
        </motion.div>
        <motion.div
          animate={floatingAnimation}
          className="absolute top-20 left-10 hidden lg:block"
        >
          <span className="text-4xl">🚀</span>
        </motion.div>
        <motion.div
          animate={floatingAnimation}
          transition={{ delay: 1 }}
          className="absolute bottom-20 right-40 hidden lg:block"
        >
          <span className="text-4xl">🌍</span>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 !leading-[1.2]">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                Start Your Space Adventure in Coding! 
              </span>
              <span className="block text-3xl mt-2">👾 🎮 🤖</span>
            </h1>
            <p className="text-xl md:text-xl mb-8 text-gray-600 dark:text-gray-300">
              Join our amazing space academy where coding is super fun! Build games, 
              control robots, and explore the cosmic world of programming!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                onClick={handleStartLearning}
                className="rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-lg"
              >
                Start Your Adventure! 🚀
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="rounded-full text-lg border-2 hover:bg-white/10"
              >
                Watch Demo Video 🎥
              </Button>
            </div>

            {/* Achievement Badges */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex items-center gap-4 justify-center lg:justify-start"
            >
              <div className="flex -space-x-4">
                {['🥇', '🏅', '🎖️', '⭐'].map((emoji, i) => (
                  <div key={i} className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 border-2 border-purple-200 flex items-center justify-center text-xl">
                    {emoji}
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Earn cool badges as you learn! ✨
              </p>
            </motion.div>
          </motion.div>

          {/* Hero Image Section */}
          <motion.div 
            className="flex-1 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-full h-full group">
              {activeView === 'solar' ? <SolarSystem /> : <Atom />}
            </div>
            {/* Toggle Buttons */}
            <div className="flex gap-4 justify-end lg:justify-end mb-8">
              <Button
                variant={activeView === 'solar' ? 'default' : 'outline'}
                onClick={() => setActiveView('solar')}
                className="rounded-full"
              >
                Solar System 🌍
              </Button>
              <Button
                variant={activeView === 'atom' ? 'default' : 'outline'}
                onClick={() => setActiveView('atom')}
                className="rounded-full"
              >
                Atomic Structure ⚛️
              </Button>
            </div>
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