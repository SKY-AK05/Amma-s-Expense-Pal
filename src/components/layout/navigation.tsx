
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ListOrdered, BarChart2, Settings } from 'lucide-react'; // Changed PlusCircle to ListOrdered
import { useI18n } from '@/contexts/i18n-context';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const pathname = usePathname();
  const { t } = useI18n();

  const navItems = [
    { href: '/', labelKey: 'navHome', icon: Home },
    { href: '/expenses', labelKey: 'navExpenses', icon: ListOrdered }, // Changed href, labelKey, icon
    { href: '/view-expenses', labelKey: 'navSummary', icon: BarChart2 },
    { href: '/settings', labelKey: 'navSettings', icon: Settings },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-background border-t border-border shadow-top-md z-50">
      <div className="container mx-auto flex justify-around items-center h-16">
        {navItems.map(item => {
          const isActive = pathname === item.href || (item.href === '/expenses' && pathname.startsWith('/add-expense')); // Highlight Expenses tab for add/edit
          const IconComponent = item.icon;
          return (
            <Link href={item.href} key={item.href} legacyBehavior>
              <a
                className={cn(
                  'flex flex-col items-center justify-center p-2 rounded-lg transition-colors w-1/4 h-full',
                  isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <IconComponent size={28} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs mt-1">{t(item.labelKey)}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
