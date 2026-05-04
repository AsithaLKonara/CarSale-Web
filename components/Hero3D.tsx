'use client';

import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, PerspectiveCamera, Environment, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

function AbstractCore() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={[0, 0, 0]} scale={1.5}>
        <torusKnotGeometry args={[1, 0.3, 200, 32]} />
        <MeshDistortMaterial
          color="#ff3e3e"
          speed={3}
          distort={0.4}
          radius={1}
          emissive="#ff3e3e"
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={1}
        />
      </mesh>
    </Float>
  );
}

const Hero3D = () => {
  return (
    <div className="hero-3d-container">
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#ff3e3e" />
          
          <AbstractCore />
          
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      <style jsx>{`
        .hero-3d-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 5;
          pointer-events: none;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .hero-3d-container {
            opacity: 0.5;
            transform: scale(0.8);
          }
        }
      `}</style>
    </div>
  );
};

export default Hero3D;
