"use client";

import { useCallback, useState } from "react";

/** px, py: -0.5 … 0.5 (төврөөс харьцангуй) — 3D эргэлтэд ашиглана */
export function useMouseParallax(strength = 18) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [norm, setNorm] = useState({ x: 0, y: 0 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      setNorm({ x: px, y: py });
      setOffset({ x: px * strength, y: py * strength });
    },
    [strength],
  );

  const onMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
    setNorm({ x: 0, y: 0 });
  }, []);

  return { offset, norm, onMouseMove, onMouseLeave };
}
