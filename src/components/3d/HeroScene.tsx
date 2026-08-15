'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { SciFiMonolith } from './SciFiMonolith';
import { ParticleField } from './ParticleField';

const CameraRig: React.FC<{ isMobile: boolean; reducedMotion: boolean }> = ({ isMobile, reducedMotion }) => {
  useFrame((state) => {
    if (reducedMotion) return;
    const factor = isMobile ? 0.3 : 1.2;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * factor, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.pointer.y * factor, 0.04);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

class EnvironmentErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('[HeroScene] Environment HDR load failed (network/CDN unavailable), falling back to procedural lights:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#06b6d4" />
          <ambientLight intensity={0.8} />
        </>
      );
    }
    return this.props.children;
  }
}

export const HeroScene: React.FC<{ videoUrl?: string; posterUrl?: string }> = ({ videoUrl, posterUrl }) => {
  const [mounted, setMounted] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [deviceTier, setDeviceTier] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const width = window.innerWidth;
      if (width < 640) setDeviceTier('mobile');
      else if (width < 1024) setDeviceTier('tablet');
      else setDeviceTier('desktop');

      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(motionQuery.matches);
    }, 0);

    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setDeviceTier('mobile');
      else if (width < 1024) setDeviceTier('tablet');
      else setDeviceTier('desktop');
    };

    window.addEventListener('resize', handleResize);

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setTimeout(() => setWebglSupported(false), 0);
      }
    } catch {
      setTimeout(() => setWebglSupported(false), 0);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const particleCount = reducedMotion
    ? 0
    : deviceTier === 'mobile'
    ? 150
    : deviceTier === 'tablet'
    ? 350
    : 750;

  if (!mounted || !webglSupported) {
    return <HeroFallback videoUrl={videoUrl} posterUrl={posterUrl} />;
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#060709]">
      {videoUrl && (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={posterUrl || '/images/rohanz-logo.png'}
          className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none z-0"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      <Canvas
        camera={{ position: [0, 0, deviceTier === 'mobile' ? 9.5 : 8], fov: 50 }}
        gl={{
          antialias: deviceTier === 'desktop',
          alpha: true,
          powerPreference: deviceTier === 'mobile' ? 'low-power' : 'high-performance',
        }}
        className="w-full h-full relative z-10"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 12, 8]} intensity={1.8} color="#ffffff" castShadow />
        <pointLight position={[-12, -8, -6]} intensity={1.2} color="#06b6d4" />
        <pointLight position={[12, 8, -6]} intensity={1.2} color="#3b82f6" />

        <Suspense fallback={null}>
          <Float speed={reducedMotion ? 0 : 1.2} rotationIntensity={0.25} floatIntensity={0.4}>
            <SciFiMonolith />
          </Float>
          {particleCount > 0 && <ParticleField count={particleCount} />}
          <EnvironmentErrorBoundary>
            <Environment preset="night" />
          </EnvironmentErrorBoundary>
        </Suspense>

        <CameraRig isMobile={deviceTier === 'mobile'} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
};

const HeroFallback: React.FC<{ videoUrl?: string; posterUrl?: string }> = ({ videoUrl, posterUrl }) => {
  return (
    <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950 via-[#060709] to-[#040507] overflow-hidden flex items-center justify-center">
      {videoUrl ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={posterUrl || '/images/rohanz-logo.png'}
          className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <>
          <div className="absolute inset-0 bg-grid-pattern opacity-15" />
          <div className="relative w-72 sm:w-80 h-72 sm:h-80 rounded-full border border-cyan-500/20 bg-cyan-500/5 animate-pulse-glow flex items-center justify-center">
            <div className="w-48 sm:w-56 h-48 sm:h-56 rounded-full border border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 to-transparent flex items-center justify-center shadow-[0_0_60px_rgba(6,182,212,0.25)]">
              <div className="w-24 sm:w-28 h-24 sm:h-28 rotate-45 border-2 border-white/70 bg-black/70 shadow-[0_0_25px_#06b6d4]" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
