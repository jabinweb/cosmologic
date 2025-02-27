"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SparkleParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  maxLife: number;
  color: string;
}

interface SparklesProps {
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
  className?: string;
  particleLife?: number;
}

export function SparklesCore({
  background = "transparent",
  minSize = 0.5,
  maxSize = 2,
  particleDensity = 100,
  particleColor = "#FFF",
  className,
  particleLife = 2000, // Particle lifetime in milliseconds
}: SparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const particlesRef = useRef<SparkleParticle[]>([]);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
      willReadFrequently: true,
    });
    if (!ctx) return;
    contextRef.current = ctx;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    const createParticles = () => {
      const particles: SparkleParticle[] = [];
      const area = (canvas.width * canvas.height) / 10000;
      const particleCount = Math.floor(area * particleDensity);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * (maxSize - minSize) + minSize,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          life: Math.random() * particleLife,
          maxLife: particleLife,
          color: particleColor,
        });
      }
      particlesRef.current = particles;
    };

    const animate = (timestamp: number) => {
      if (!ctx || !canvas) return;
      
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Update
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.life -= deltaTime;

        // Reset if lifetime expired
        if (particle.life <= 0) {
          particle.life = particle.maxLife;
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
        }

        // Wrap around edges
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        // Draw
        const opacity = (particle.life / particle.maxLife) * 0.8 + 0.2;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(
          ")",
          `,${opacity})`
        );
        ctx.fill();
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    // Setup
    resizeCanvas();
    createParticles();
    lastTimeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(animate);

    // Resize handler
    window.addEventListener("resize", resizeCanvas);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [maxSize, minSize, particleColor, particleDensity, particleLife]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0", className)}
      style={{ background }}
    />
  );
}
