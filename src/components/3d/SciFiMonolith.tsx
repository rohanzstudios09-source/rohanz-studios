'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SciFiMonolith: React.FC = () => {
  const outerMeshRef = useRef<THREE.Mesh>(null!);
  const innerCoreRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Group>(null!);
  const debrisGroupRef = useRef<THREE.Group>(null!);

  // Generate deterministic pseudo-random procedural floating elements
  const debris = useMemo(() => {
    const items = [];
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
      return x - Math.floor(x);
    };

    for (let i = 0; i < 18; i++) {
      const r1 = pseudoRandom(i * 1.1 + 1);
      const r2 = pseudoRandom(i * 2.3 + 2);
      const r3 = pseudoRandom(i * 3.7 + 3);

      const scale = 0.15 + r1 * 0.35;
      const radius = 3.5 + r2 * 4.5;
      const angle = (i / 18) * Math.PI * 2 + (r3 - 0.5);
      const y = (r1 - 0.5) * 4;

      items.push({
        position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius] as [number, number, number],
        rotation: [r1 * Math.PI, r2 * Math.PI, 0] as [number, number, number],
        scale,
      });
    }
    return items;
  }, []);

  useFrame((state, delta) => {
    if (outerMeshRef.current) {
      outerMeshRef.current.rotation.y += delta * 0.2;
      outerMeshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
    }
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y -= delta * 0.4;
      innerCoreRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.12;
      ringRef.current.rotation.y += delta * 0.08;
    }
    if (debrisGroupRef.current) {
      debrisGroupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Obsidian Sci-Fi Monolith */}
      <mesh ref={outerMeshRef} position={[0, 0, 0]} castShadow receiveShadow>
        <octahedronGeometry args={[2.2, 0]} />
        <meshStandardMaterial
          color="#0c1322"
          roughness={0.2}
          metalness={0.9}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* Cyber Wireframe Overlay */}
      <mesh position={[0, 0, 0]} scale={1.02}>
        <octahedronGeometry args={[2.2, 0]} />
        <meshBasicMaterial
          color="#06b6d4"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Inner Emissive Energy Core */}
      <mesh ref={innerCoreRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.65} />
      </mesh>

      {/* Floating Orbital Rings */}
      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[3.6, 0.02, 16, 100]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} />
        </mesh>
        <mesh rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
          <torusGeometry args={[4.4, 0.015, 16, 100]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.3} />
        </mesh>
      </group>

      {/* Layered Floating Environmental Debris / Rocks */}
      <group ref={debrisGroupRef}>
        {debris.map((d, idx) => (
          <mesh key={idx} position={d.position} rotation={d.rotation} scale={d.scale}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.7} />
          </mesh>
        ))}
      </group>

      {/* Central Point Lights */}
      <pointLight color="#06b6d4" intensity={4.5} distance={12} decay={2} />
      <pointLight color="#f59e0b" position={[2, -2, 2]} intensity={2} distance={8} decay={2} />
    </group>
  );
};
