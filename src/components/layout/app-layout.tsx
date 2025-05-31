'use client';

import React from 'react';
import Header from './header';
import Navigation from './navigation';
import { useI18n } from '@/contexts/i18n-context';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { language } = useI18n(); // to trigger re-render on language change for body class

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Navigation />
    </div>
  );
};

export default AppLayout;
