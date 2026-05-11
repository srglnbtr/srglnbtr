"use client";

import { useLoader } from "@react-three/fiber";
import { useLayoutEffect, useMemo } from "react";
import {
  Box3,
  Mesh,
  MeshStandardMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
  type Group,
} from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

type HeroAvatarObjProps = {
  url: string;
  textureUrl?: string;
  scale?: number;
  positionY?: number;
};

export function HeroAvatarObj({
  url,
  textureUrl,
  scale = 1,
  positionY = 0,
}: HeroAvatarObjProps) {
  const src = url.startsWith("http") ? url : encodeURI(url);
  const root = useLoader(OBJLoader, src) as Group;
  const textureSrc = textureUrl
    ? textureUrl.startsWith("http")
      ? textureUrl
      : encodeURI(textureUrl)
    : "/file.svg";
  const texture = useLoader(TextureLoader, textureSrc);
  const clone = useMemo(() => root.clone(true), [root]);

  useLayoutEffect(() => {
    if (textureUrl) {
      texture.colorSpace = SRGBColorSpace;
      texture.needsUpdate = true;
      clone.traverse((child) => {
        if (child instanceof Mesh) {
          child.material = new MeshStandardMaterial({
            map: texture,
            roughness: 0.5,
            metalness: 0.05,
          });
          child.castShadow = false;
          child.receiveShadow = false;
        }
      });
    }

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
  }, [clone, texture, textureUrl, scale, positionY]);

  return <primitive object={clone} />;
}
