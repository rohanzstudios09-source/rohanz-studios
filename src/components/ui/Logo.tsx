'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  href?: string;
  className?: string;
  priority?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  href = '/',
  className,
  priority = false,
}) => {
  const dimensions = {
    sm: { width: 40, height: 40, text: 'text-base' },
    md: { width: 52, height: 52, text: 'text-xl' },
    lg: { width: 72, height: 72, text: 'text-2xl' },
    xl: { width: 110, height: 110, text: 'text-3xl' },
  }[size];

  const logoContent = (
    <div className={cn('flex items-center gap-3.5 group transition-all duration-300', className)}>
      <div className="relative flex items-center justify-center filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-105">
        <Image
          src="/images/rohanz-logo.png"
          alt="Rohanz Studios Logo"
          width={dimensions.width}
          height={dimensions.height}
          priority={priority}
          className="object-contain"
          style={{ width: 'auto', height: `${dimensions.height}px` }}
        />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={cn('font-black tracking-[0.2em] text-white group-hover:text-cyan-400 transition-colors duration-300 uppercase', dimensions.text)}>
            ROHANZ
          </span>
          <span className="text-[10px] tracking-[0.3em] font-mono font-semibold text-cyan-500/80 group-hover:text-cyan-300">
            STUDIOS
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label="Rohanz Studios Home"
        className="inline-block transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
      >
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};
