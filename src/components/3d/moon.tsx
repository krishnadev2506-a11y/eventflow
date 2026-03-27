"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

export function Moon() {
  const moonRef = useRef<THREE.Mesh>(null!);
  const auraRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.08;
      moonRef.current.rotation.z += delta * 0.02;
    }
    if (auraRef.current) {
      auraRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.02);
    }
  });

  return (
    <group>
      <ambientLight intensity={0.2} color="#7c3aed" />
      <directionalLight position={[5, 3, 5]} intensity={2} color="#00f5ff" />
      <directionalLight position={[-5, -3, -5]} intensity={1} color="#4f8ef7" />
      
      {/* Core Moon */}
      <Sphere ref={moonRef} args={[2.5, 32, 32]}>
        <meshStandardMaterial 
          color="#c4c9d4"
          roughness={0.6}
          metalness={0.4}
          wireframe
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Glow Aura */}
      <Sphere ref={auraRef} args={[2.7, 32, 32]}>
        <meshBasicMaterial 
          color="#4f8ef7"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>
    </group>
  );
}
