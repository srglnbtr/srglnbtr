"use client";

import { useGLTF } from "@react-three/drei";
import { useLayoutEffect, useMemo } from "react";
import type { Group } from "three";
import { Box3, Vector3 } from "three";
import { SkeletonUtils } from "three-stdlib";

type HeroAvatarGlbProps = {
  url: string;
  /** Жижир загварт томруулна */
  scale?: number;
  /** Төвийг доош/дээш нь тохируулна */
  positionY?: number;
};

/**
 * public/ доторх GLB (жишээ: /models/avatar.glb).
 * Blender / Ready Player Me / Spline export гэх мэтээр үүсгэсэн загварыг ашиглана.
 */
export function HeroAvatarGlb({ url, scale = 1.65, positionY = 0 }: HeroAvatarGlbProps) {
  const { scene } = useGLTF(url);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  useLayoutEffect(() => {
    clone.updateMatrixWorld(true);
    const box = new Box3().setFromObject(clone);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    clone.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const fit = (2.2 / maxDim) * scale;
    clone.scale.setScalar(fit);
    clone.position.y += positionY;
  }, [clone, scale, positionY]);

  return <primitive object={clone as Group} />;
}
