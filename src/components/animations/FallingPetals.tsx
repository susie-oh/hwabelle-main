import { useEffect, useState, useMemo, memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PetalComponents, petalColors } from "@/components/decorations/PetalShapes";

interface FallingPetal {
  id: number;
  Component: typeof PetalComponents[number];
  x: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  rotation: number;
  drift: number;
}

const PETAL_COUNT = 18;

const generatePetal = (id: number): FallingPetal => ({
  id,
  Component: PetalComponents[Math.floor(Math.random() * PetalComponents.length)],
  x: Math.random() * 100,
  delay: Math.random() * 15,
  duration: 12 + Math.random() * 10,
  size: 14 + Math.random() * 14,
  color: petalColors[Math.floor(Math.random() * petalColors.length)],
  rotation: Math.random() * 360,
  drift: (Math.random() - 0.5) * 100,
});

const FallingPetalItem = memo(({ petal }: { petal: FallingPetal }) => {
  const { Component, x, delay, duration, size, color, rotation, drift } = petal;

  return (
    <motion.div
      className="absolute pointer-events-none will-change-transform"
      style={{ left: `${x}%`, top: -50 }}
      initial={{ y: -50, rotate: rotation, x: 0, opacity: 0 }}
      animate={{
        y: ["0vh", "110vh"],
        rotate: [rotation, rotation + 180],
        x: [0, drift, drift * 0.5, drift * 1.2, 0],
        opacity: [0, 0.7, 0.6, 0.5, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
        times: [0, 0.1, 0.5, 0.9, 1],
      }}
    >
      <Component size={size} color={color} />
    </motion.div>
  );
});
FallingPetalItem.displayName = "FallingPetalItem";

interface FallingPetalsProps {
  enabled?: boolean;
}

const FallingPetals = ({ enabled = true }: FallingPetalsProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delay mounting for performance
    const timer = setTimeout(() => setMounted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const petals = useMemo(() => 
    Array.from({ length: PETAL_COUNT }, (_, i) => generatePetal(i)),
    []
  );

  if (!enabled || shouldReduceMotion || !mounted) return null;

  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none z-50"
      aria-hidden="true"
    >
      {petals.map((petal) => (
        <FallingPetalItem key={petal.id} petal={petal} />
      ))}
    </div>
  );
};

export default memo(FallingPetals);
