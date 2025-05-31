
'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/contexts/i18n-context';
import { useExpenses } from '@/hooks/use-expenses';
import { PlusCircle, CreditCard, Gift, ListChecks, Eye } from 'lucide-react';
import type { Expense, CategoryKey, Language } from '@/types';
import { format, parseISO, isToday, getMonth, getYear } from 'date-fns';
import type { Locale } from 'date-fns';
import { enUS, ta as taDateLocale, hi as hiDateLocale } from 'date-fns/locale';

const dateLocales: Record<Language, Locale> = {
  en: enUS,
  ta: taDateLocale,
  hi: hiDateLocale,
};

export default function HomePage() {
  const { t, getLocalizedCategories, language } = useI18n();
  const { expenses } = useExpenses();

  const localizedCategories = getLocalizedCategories();
  const categoryDisplay = (categoryKey: CategoryKey) => localizedCategories[categoryKey] || categoryKey;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR' }).format(amount);
  };

  const todayExpensesTotal = useMemo(() => {
    return expenses
      .filter(expense => isToday(parseISO(expense.date)))
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const monthlyTotalExpenses = useMemo(() => {
    const now = new Date();
    const currentMonth = getMonth(now);
    const currentYear = getYear(now);
    return expenses
      .filter(expense => {
        const expenseDate = parseISO(expense.date);
        return getMonth(expenseDate) === currentMonth && getYear(expenseDate) === currentYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const recentTransactions = useMemo(() => {
    return [...expenses]
      .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
      .slice(0, 5);
  }, [expenses]);

  const quickActionButtons = [
    {
      href: '/add-expense?category=daily',
      icon: PlusCircle,
      labelKey: 'homeAddDailyExpenseButton',
      category: 'daily' as CategoryKey,
    },
    {
      href: '/add-expense?category=creditCard',
      icon: CreditCard,
      labelKey: 'homeAddCreditCardExpenseButton',
      category: 'creditCard' as CategoryKey,
    },
    {
      href: '/add-expense?category=special',
      icon: Gift,
      labelKey: 'homeAddSpecialExpenseButton',
      category: 'special' as CategoryKey,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Expense Summary Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{t('homeExpensesSummaryTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-center md:text-left">
          <div>
            <p className="text-sm text-muted-foreground">{t('homeTodayLabel')}</p>
            <p className="text-3xl font-bold text-primary">{formatCurrency(todayExpensesTotal)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('homeThisMonthLabel')}</p>
            <p className="text-3xl font-bold text-primary">{formatCurrency(monthlyTotalExpenses)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{t('homeQuickActionsTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {quickActionButtons.map(action => (
            <Link href={action.href} passHref key={action.category}>
              <Button variant="outline" size="lg" className="w-full justify-start btn-xl text-lg py-6">
                <action.icon className="mr-3 h-7 w-7" /> {t(action.labelKey)}
              </Button>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Recent Transactions Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{t('homeRecentTransactionsTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <ul className="space-y-4">
              {recentTransactions.map(expense => (
                <li key={expense.id} className="flex justify-between items-start p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-grow mr-4">
                    <p className="font-medium text-lg">{categoryDisplay(expense.category)}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(expense.date), 'PP', { locale: dateLocales[language] })}
                    </p>
                    {expense.notes && (
                      <p className="text-sm text-foreground/80 mt-1 truncate max-w-xs md:max-w-sm" title={expense.notes}>
                        {expense.notes}
                      </p>
                    )}
                  </div>
                  <p className="text-xl font-semibold text-primary whitespace-nowrap">
                    {formatCurrency(expense.amount)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center py-4">{t('homeNoRecentTransactionsMessage')}</p>
          )}
        </CardContent>
      </Card>
      
      {/* General Action Buttons (Add & View All) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Link href="/add-expense" passHref>
          <Button variant="default" size="lg" className="w-full btn-xl">
            <ListChecks className="mr-2 h-6 w-6" /> {t('homeAddExpenseButton')}
          </Button>
        </Link>
        <Link href="/view-expenses" passHref>
          <Button variant="outline" size="lg" className="w-full btn-xl">
            <Eye className="mr-2 h-6 w-6" /> {t('homeViewExpensesButton')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
