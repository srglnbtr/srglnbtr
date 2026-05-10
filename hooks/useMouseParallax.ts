"use client";

import { useCallback, useState } from "react";

export function useMouseParallax(strength = 18) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      setOffset({ x: px * strength, y: py * strength });
    },
    [strength],
  );

  const onMouseLeave = useCallback(() => setOffset({ x: 0, y: 0 }), []);

  return { offset, onMouseMove, onMouseLeave };
}
