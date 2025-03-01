'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipProvider, TooltipContent } from '@/components/ui/tooltip';
import { PLANETS_DATA } from './data';

export function SolarSystem() {
  const [isSystemPaused, setIsSystemPaused] = useState(false);

  // Generate random stars
  const stars = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
  }));

  // Generate shooting stars
  const shootingStars = Array.from({ length: 3 }, (_, i) => ({
    id: i,
    delay: i * 4,
    duration: 2 + Math.random() * 2,
    top: `${Math.random() * 50}%`,
    left: `${Math.random() * 50}%`,
  }));

  return (
    <div 
      className="w-full h-[600px] relative"
      onMouseEnter={() => setIsSystemPaused(true)}
      onMouseLeave={() => setIsSystemPaused(false)}
    >
      <TooltipProvider>
        {/* Stars */}
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              width: star.size,
              height: star.size,
              top: star.top,
              left: star.left,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              delay: star.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {/* Shooting Stars */}
        {shootingStars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute h-px w-[100px] bg-white"
            style={{
              top: star.top,
              left: star.left,
              rotate: 45,
            }}
            animate={{
              x: [0, 200],
              y: [0, 200],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {/* Solar System */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Planets Orbits - rendered first for proper z-index */}
          {PLANETS_DATA.map((planet) => (
            <div
              key={`orbit-${planet.name}`}
              className="absolute rounded-full border border-gray-200/20"
              style={{
                width: planet.orbitRadius * 2,
                height: planet.orbitRadius * 2,
              }}
            />
          ))}

          {/* Sun */}
          <Tooltip>
            <motion.div
              className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-300 to-orange-500 z-10"
              animate={{
                scale: [1, 1.05, 1],
                rotate: 360,
              }}
              transition={{
                scale: { duration: 3, repeat: Infinity },
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              }}
            />
            <TooltipContent>
              <div className="text-center p-2">The Sun</div>
            </TooltipContent>
          </Tooltip>

          {/* Planets */}
          {PLANETS_DATA.map((planet) => (
            <motion.div
              key={planet.name}
              className="absolute"
              style={{
                width: planet.orbitRadius * 2,
                height: planet.orbitRadius * 2,
              }}
              animate={{
                rotate: isSystemPaused ? 0 : 360,
              }}
              transition={{
                duration: planet.orbitDuration,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              <Tooltip>
                <motion.div
                  className="absolute rounded-full cursor-pointer"
                  style={{
                    width: planet.size,
                    height: planet.size,
                    backgroundColor: planet.color,
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                  animate={{
                    rotate: isSystemPaused ? 0 : 360,
                  }}
                  transition={{
                    duration: planet.rotationDuration,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                  whileHover={{ scale: 1.5 }}
                />
                <TooltipContent>
                  <div className="text-center p-2">{planet.name}</div>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}
