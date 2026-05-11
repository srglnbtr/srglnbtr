"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import type { Group } from "three";
import { Box3, Vector3 } from "three";
import { SkeletonUtils } from "three-stdlib";

type HeroAvatarGlbProps = {
  url: string;
  scale?: number;
  positionY?: number;
};

export function HeroAvatarGlb({ url, scale = 1.3, positionY = 0 }: HeroAvatarGlbProps) {
  const { scene } = useGLTF(url);

  // clone + scale тооцоог useMemo дотор нэг удаа хийнэ
  // useLayoutEffect ашиглахгүй → Strict Mode / HMR-д давхар ажиллахгүй
  const clone = useMemo(() => {
    const c = SkeletonUtils.clone(scene);
    c.updateMatrixWorld(true);

    const box = new Box3().setFromObject(c);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);

    // X, Z голыг тэгшитгэнэ, Y-г доороос тооцно
    c.position.x = -center.x;
    c.position.z = -center.z;

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const fit = (4.65 / maxDim) * scale;
    c.scale.setScalar(fit);

    // Хөлөө газарт тавина + positionY offset
    c.position.y = -(size.y / 2) * fit + positionY;

    return c;
  }, [scene, scale, positionY]);

  return <primitive object={clone as Group} />;
}