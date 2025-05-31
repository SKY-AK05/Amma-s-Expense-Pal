'use client';

import React from 'react';
import { useI18n } from '@/contexts/i18n-context';
import {Coins} from 'lucide-react';

const Header = () => {
  const { t } = useI18n();

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <Coins size={32} className="mr-3 text-primary-foreground" />
        <h1 className="text-2xl md:text-3xl font-headline font-bold">{t('appName')}</h1>
      </div>
    </header>
  );
};

export default Header;
