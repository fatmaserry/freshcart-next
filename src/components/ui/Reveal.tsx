"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type Direction = "up" | "down" | "left" | "right";

interface RevealProps {
  children: ReactNode;
  from?: Direction;
  distance?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  className?: string;
}

const offset = (from: Direction, d: number) =>
  ({
    up: { x: 0, y: d },
    down: { x: 0, y: -d },
    left: { x: -d, y: 0 },
    right: { x: d, y: 0 },
  })[from];

export function Reveal({
  children,
  from = "up",
  distance = 20,
  duration = 0.6,
  delay = 0,
  once = true,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting && once) observer.disconnect();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const { x, y } = offset(from, distance);
  const style = {
    "--reveal-x": `${x}px`,
    "--reveal-y": `${y}px`,
    "--reveal-duration": `${duration}s`,
    "--reveal-delay": `${delay}s`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      data-reveal=""
      data-visible={inView ? "" : undefined}
      style={style}
      className={className}
    >
      {children}
    </div>
  );
}
