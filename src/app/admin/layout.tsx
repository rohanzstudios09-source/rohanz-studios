import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin CMS',
  description: 'Rohanz Studios Content Management System Dashboard',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#060709] text-slate-100 flex">
      {children}
    </div>
  );
}
