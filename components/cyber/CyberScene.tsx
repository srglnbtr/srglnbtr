"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Stars, TorusKnot } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { MathUtils, type Group } from "three";
import { HeroAvatarGlb } from "@/components/cyber/HeroAvatarGlb";
import { HeroAvatarImage } from "@/components/cyber/HeroAvatarImage";
import { HeroAvatarObj } from "@/components/cyber/HeroAvatarObj";

export type HeroScenePointer = { x: number; y: number };

const DEFAULT_GLB_PATH = "/models/avatar.glb";

function resolveHeroGltfPath(): string {
  const fromEnv = process.env.NEXT_PUBLIC_HERO_GLTF_URL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_GLB_PATH;
}

function buildObjCandidates(): string[] {
  const out: string[] = [];
  const fromEnv = process.env.NEXT_PUBLIC_HERO_OBJ_URL?.trim();
  if (fromEnv) out.push(fromEnv);
  out.push("/models/avatar.glb.obj", "/models/avatar.obj", "/models/model.obj");
  return [...new Set(out)];
}

function buildImageCandidates(): string[] {
  const out: string[] = [];
  const fromEnv = process.env.NEXT_PUBLIC_HERO_IMAGE_URL?.trim();
  if (fromEnv) out.push(fromEnv);
  out.push("/models/avatar.png", "/models/hero.png", "/models/portrait.png");
  for (let i = 12; i >= 2; i--) {
    out.push(`/models/avatar (${i}).png`);
  }
  return [...new Set(out)];
}

async function headOk(path: string): Promise<boolean> {
  try {
    const r = await fetch(encodeURI(path), { method: "HEAD" });
    return r.ok;
  } catch {
    return false;
  }
}

type HeroAsset =
  | { kind: "glb"; url: string }
  | { kind: "obj"; url: string; textureUrl?: string }
  | { kind: "image"; url: string };

function AbstractGeometry() {
  return (
    <group scale={1.15}>
      <TorusKnot args={[0.52, 0.16, 120, 28]}>
        <meshStandardMaterial
          color="#38bdf8"
          metalness={0.92}
          roughness={0.12}
          emissive="#0284c7"
          emissiveIntensity={0.4}
        />
      </TorusKnot>
      <Sphere args={[0.2, 32, 32]} position={[0, 0.82, 0.38]}>
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#6d28d9"
          emissiveIntensity={0.55}
          metalness={0.45}
          roughness={0.28}
        />
      </Sphere>
    </group>
  );
}

function HeroMouseRig({
  pointerRef,
  children,
}: {
  pointerRef: React.MutableRefObject<HeroScenePointer>;
  children: React.ReactNode;
}) {
  const ref = useRef<Group>(null);

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;

    const { x: nx, y: ny } = pointerRef.current;
    const targetY = nx * 0.85;
    const targetX = ny * -0.55;
    g.rotation.y = MathUtils.lerp(g.rotation.y, targetY, 0.1);
    g.rotation.x = MathUtils.lerp(g.rotation.x, targetX, 0.1);

    const idle = Math.abs(nx) + Math.abs(ny) < 0.04;
    if (idle) g.rotation.y += dt * 0.12;
  });

  return (
    <Float speed={2.2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={ref}>{children}</group>
    </Float>
  );
}

function CyberFigure({
  pointerRef,
  asset,
}: {
  pointerRef: React.MutableRefObject<HeroScenePointer>;
  asset: HeroAsset | null;
}) {
  return (
    <HeroMouseRig pointerRef={pointerRef}>
      {asset?.kind === "glb" ? (
        <Suspense fallback={<AbstractGeometry />}>
          <HeroAvatarGlb url={asset.url} />
        </Suspense>
      ) : asset?.kind === "obj" ? (
        <Suspense fallback={<AbstractGeometry />}>
          <HeroAvatarObj url={asset.url} textureUrl={asset.textureUrl} />
        </Suspense>
      ) : asset?.kind === "image" ? (
        <Suspense fallback={<AbstractGeometry />}>
          <HeroAvatarImage url={asset.url} />
        </Suspense>
      ) : (
        <AbstractGeometry />
      )}
    </HeroMouseRig>
  );
}

type CyberSceneProps = {
  pointer?: HeroScenePointer;
};

export function CyberScene({ pointer = { x: 0, y: 0 } }: CyberSceneProps) {
  const pointerRef = useRef<HeroScenePointer>(pointer);
  pointerRef.current = pointer;

  const [asset, setAsset] = useState<HeroAsset | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const glbPath = resolveHeroGltfPath();
      if (glbPath.toLowerCase().endsWith(".glb") && (await headOk(glbPath))) {
        if (!cancelled) setAsset({ kind: "glb", url: glbPath });
        return;
      }
      let objTexture: string | undefined;
      for (const t of buildImageCandidates()) {
        if (cancelled) return;
        if (await headOk(t)) {
          objTexture = t;
          break;
        }
      }
      for (const p of buildObjCandidates()) {
        if (cancelled) return;
        if (await headOk(p)) {
          if (!cancelled) setAsset({ kind: "obj", url: p, textureUrl: objTexture });
          return;
        }
      }
      for (const p of buildImageCandidates()) {
        if (cancelled) return;
        if (await headOk(p)) {
          if (!cancelled) setAsset({ kind: "image", url: p });
          return;
        }
      }
      if (!cancelled) setAsset(null);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="h-[520px] w-full md:h-[650px]">
      <Canvas
        camera={{ position: [0, 2.5, 5.5], fov: 38 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <Stars
          radius={80}
          depth={60}
          count={1800}
          factor={3.5}
          saturation={0.1}
          fade
          speed={0.35}
        />
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 5, 3]} intensity={1.1} color="#38bdf8" />
        <pointLight position={[-3.5, 1.5, 2.5]} intensity={55} color="#8b5cf6" />
        <spotLight
          position={[0, 3.2, 2]}
          angle={0.5}
          penumbra={0.85}
          intensity={22}
          color="#f0abfc"
          castShadow={false}
          />
        <CyberFigure pointerRef={pointerRef} asset={asset} />
      </Canvas>
    </div>
  );
}