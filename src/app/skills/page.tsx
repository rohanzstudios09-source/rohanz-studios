import React from 'react';
import { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SkillMatrix } from '@/components/studio/SkillMatrix';

import { siteConfig } from '@/config/siteConfig';

export const metadata: Metadata = {
  title: 'Skills & Tools',
  description: 'Technical proficiencies, game engines, graphics languages, and tools mastered by Rohanz Studios.',
  alternates: {
    canonical: `${siteConfig.siteUrl}/skills`,
  },
  openGraph: {
    title: 'Skills & Tools | Rohanz Studios',
    description: 'Technical proficiencies, game engines, graphics languages, and tools mastered by Rohanz Studios.',
    url: `${siteConfig.siteUrl}/skills`,
    siteName: 'Rohanz Studios',
    images: [{ url: `${siteConfig.siteUrl}/images/rohanz-logo.png` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skills & Tools | Rohanz Studios',
    description: 'Technical proficiencies, game engines, graphics languages, and tools mastered by Rohanz Studios.',
    images: [`${siteConfig.siteUrl}/images/rohanz-logo.png`],
  },
};

export default function SkillsPage() {
  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <SectionHeading
        badge="TECHNICAL MATRIX"
        title="ENGINES, SYSTEMS & TOOLS"
        subtitle="Unreal Engine 5, Unity 3D, C++, C#, HLSL/GLSL Shader programming, Three.js, Blender 3D, and audio middleware."
      />
      <SkillMatrix />
    </div>
  );
}
