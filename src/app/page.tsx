'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/contexts/i18n-context';
import { useExpenses } from '@/hooks/use-expenses';
import { CategoryPieChart } from '@/components/dashboard/category-pie-chart';
import { PlusCircle, Eye } from 'lucide-react';
import type { Expense, CategoryKey } from '@/types';

export default function HomePage() {
  const { t, getLocalizedCategories } = useI18n();
  const { expenses } = useExpenses();

  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
  }, [expenses]);

  const totalExpenses = useMemo(() => {
    return currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [currentMonthExpenses]);

  const categoryBreakdown = useMemo(() => {
    const breakdown: { name: string; value: number; fill: string }[] = [];
    const localizedCategories = getLocalizedCategories();
    
    const categoryTotals: Record<CategoryKey, number> = {
      daily: 0,
      creditCard: 0,
      special: 0,
    };

    currentMonthExpenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    const categoryColors: Record<CategoryKey, string> = {
      daily: 'hsl(var(--chart-1))',
      creditCard: 'hsl(var(--chart-2))',
      special: 'hsl(var(--chart-3))',
    };

    for (const key in categoryTotals) {
      if (categoryTotals[key as CategoryKey] > 0) {
        breakdown.push({
          name: localizedCategories[key] || key,
          value: categoryTotals[key as CategoryKey],
          fill: categoryColors[key as CategoryKey]
        });
      }
    }
    return breakdown;
  }, [currentMonthExpenses, getLocalizedCategories]);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{t('homeTotalExpenses')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-primary">
            {new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR' }).format(totalExpenses)}
          </p>
        </CardContent>
      </Card>

      {categoryBreakdown.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">{t('homeCategoryBreakdown')}</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryPieChart data={categoryBreakdown} />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/add-expense" passHref>
          <Button variant="default" size="lg" className="w-full btn-xl">
            <PlusCircle className="mr-2 h-6 w-6" /> {t('homeAddExpenseButton')}
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
