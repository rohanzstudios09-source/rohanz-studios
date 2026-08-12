'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getAdminSession } from '@/lib/supabase/client';

export const AdminAuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function verifyAuth() {
      const active = await getAdminSession();
      if (!active) {
        router.push('/admin');
      } else {
        setAuthorized(true);
      }
    }
    verifyAuth();
  }, [router]);

  if (!authorized) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#060709] text-cyan-400 font-mono text-xs gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>VERIFYING STUDIO ADMIN SESSION...</span>
      </div>
    );
  }

  return <>{children}</>;
};
