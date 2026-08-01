import { useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

export function useScrollMinimized(threshold = 50) {
  const scrollY = useMotionValue(0);

  useEffect(() => {
    const handler = () => scrollY.set(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [scrollY]);

  const isScrolled = useTransform(scrollY, [0, threshold], [false, true]);
  const py = useTransform(scrollY, [0, threshold], ["py-3", "py-1"]);
  const opacity = useTransform(scrollY, [0, threshold], [1, 0.6]);
  const scale = useTransform(scrollY, [0, threshold], [1, 0.95]);

  return { isScrolled, py, opacity, scale };
}
