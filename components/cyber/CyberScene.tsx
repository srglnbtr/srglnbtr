"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Stars, TorusKnot } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

function CyberFigure() {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.28;
  });
  return (
    <Float speed={2.2} rotationIntensity={0.35} floatIntensity={0.55}>
      <group ref={ref} scale={1.15}>
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
    </Float>
  );
}

export function CyberScene() {
  return (
    <div className="h-[300px] w-full md:h-[400px]">
      <Canvas
        camera={{ position: [0, 0.15, 4.1], fov: 42 }}
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
        <CyberFigure />
      </Canvas>
    </div>
  );
}
