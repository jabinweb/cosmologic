'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipProvider, TooltipContent } from '@/components/ui/tooltip';

export function Atom() {
  const [isPaused, setIsPaused] = useState(false);

  // Bohr model of a Helium atom with 2 electron shells
  const shells = [
    { 
      level: 1,
      electrons: 2,
      radius: 100,
      period: 3,
      energyLevel: "1s²"
    }
  ];

  // Helium nucleus (2 protons, 2 neutrons)
  const nucleusParticles = [
    { id: 'p1', type: 'proton', color: '#FF4444', charge: '+1' },
    { id: 'p2', type: 'proton', color: '#FF4444', charge: '+1' },
    { id: 'n1', type: 'neutron', color: '#44AAFF', charge: '0' },
    { id: 'n2', type: 'neutron', color: '#44AAFF', charge: '0' }
  ];

  return (
    <div className="w-[400px] h-[400px] relative">
      <TooltipProvider>
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Electron Probability Clouds */}
          {shells.map((shell, index) => (
            <motion.div
              key={`shell-${shell.level}`}
              className="absolute rounded-full"
              style={{
                width: shell.radius * 2,
                height: shell.radius * 2,
                background: `radial-gradient(circle, 
                  rgba(96, 165, 250, 0.1) 0%,
                  rgba(96, 165, 250, 0.05) 50%,
                  transparent 70%
                )`,
              }}
            >
              {/* Electrons in this shell */}
              {Array.from({ length: shell.electrons }).map((_, i) => (
                <motion.div
                  key={`electron-${shell.level}-${i}`}
                  className="absolute w-3 h-3 bg-blue-400 rounded-full"
                  style={{
                    boxShadow: '0 0 10px rgba(96, 165, 250, 0.5)',
                  }}
                  animate={!isPaused ? {
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  } : {}}
                  transition={{
                    rotate: {
                      duration: shell.period,
                      ease: "linear",
                      repeat: Infinity,
                    },
                    scale: {
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }
                  }}
                  initial={{ rotate: (360 / shell.electrons) * i }}
                >
                  <Tooltip>
                    <div className="w-full h-full" />
                    <TooltipContent>
                      <div className="text-xs">
                        Electron (Shell {shell.level})
                        <br />
                        Energy Level: {shell.energyLevel}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              ))}
            </motion.div>
          ))}

          {/* Nucleus */}
          <motion.div
            className="relative w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-blue-500/20 flex items-center justify-center"
            animate={!isPaused ? {
              rotate: 360,
            } : {}}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {nucleusParticles.map((particle, index) => (
              <motion.div
                key={particle.id}
                className="absolute w-6 h-6 rounded-full"
                style={{
                  backgroundColor: particle.color,
                  boxShadow: `0 0 8px ${particle.color}80`,
                }}
                animate={!isPaused ? {
                  x: [0, 3, -3, 0],
                  y: [0, -3, 3, 0],
                } : {}}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: index * 0.5,
                }}
              >
                <Tooltip>
                  <div className="w-full h-full" />
                  <TooltipContent>
                    <div className="text-xs capitalize">
                      {particle.type}
                      <br />
                      Charge: {particle.charge}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </TooltipProvider>
    </div>
  );
}
