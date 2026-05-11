"use client";

import { useTexture } from "@react-three/drei";
import { useLayoutEffect, useMemo } from "react";
import { DoubleSide, SRGBColorSpace } from "three";

type HeroAvatarImageProps = {
  /** public/ доорх зам, жишээ: /models/avatar (6).png */
  url: string;
};

export function HeroAvatarImage({ url }: HeroAvatarImageProps) {
  const src = useMemo(
    () => (url.startsWith("http") ? url : encodeURI(url)),
    [url],
  );
  const tex = useTexture(src);

  useLayoutEffect(() => {
    tex.colorSpace = SRGBColorSpace;
    tex.needsUpdate = true;
  }, [tex]);

  const { width, height } = useMemo(() => {
    const img = tex.image as HTMLImageElement | undefined;
    const w = img?.width ?? 512;
    const h = img?.height ?? 512;
    const aspect = w / h;
    const base = 2.35;
    return aspect >= 1
      ? { width: base * aspect, height: base }
      : { width: base, height: base / aspect };
  }, [tex]);

  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        map={tex}
        transparent
        alphaTest={0.04}
        side={DoubleSide}
        roughness={0.42}
        metalness={0.06}
      />
    </mesh>
  );
}
