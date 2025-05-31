
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useExpenses } from '@/hooks/use-expenses';
import { useI18n } from '@/contexts/i18n-context';
import type { Expense, CategoryKey, Language } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Filter, Download, BarChart2 } from 'lucide-react';
import { format, parseISO, addMonths, subMonths, getYear, getMonth } from 'date-fns';
import type { Locale } from 'date-fns';
import { enUS, ta as taDateLocale, hi as hiDateLocale } from 'date-fns/locale';
import { exportToCsv } from '@/utils/export';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const dateLocales: Record<Language, Locale> = {
  en: enUS,
  ta: taDateLocale,
  hi: hiDateLocale,
};

interface CategorySummary {
  key: CategoryKey;
  name: string;
  total: number;
  percentage: number;
  colorClass: string;
}

export default function MonthlySummaryPage() {
  const { expenses } = useExpenses();
  const { t, getLocalizedCategories, language } = useI18n();
  const { toast } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());

  const localizedCategories = getLocalizedCategories();

  const categoryDisplay = (categoryKey: CategoryKey) => localizedCategories[categoryKey] || categoryKey;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const formattedCurrentMonth = useMemo(() => {
    return format(currentDate, 'MMMM yyyy', { locale: dateLocales[language] });
  }, [currentDate, language]);

  const monthlyExpenses = useMemo(() => {
    const targetMonth = getMonth(currentDate);
    const targetYear = getYear(currentDate);
    return expenses.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return getMonth(expenseDate) === targetMonth && getYear(expenseDate) === targetYear;
    });
  }, [expenses, currentDate]);

  const categorySummaryData = useMemo(() => {
    const categoryTotals: Record<CategoryKey, number> = {
      daily: 0,
      creditCard: 0,
      special: 0,
    };

    monthlyExpenses.forEach(expense => {
      categoryTotals[expense.category] += expense.amount;
    });

    const grandTotal = Object.values(categoryTotals).reduce((sum, total) => sum + total, 0);

    const colors: Record<CategoryKey, string> = {
      daily: 'bg-chart-1',
      creditCard: 'bg-chart-2',
      special: 'bg-chart-3',
    };
    
    const legendColors: Record<CategoryKey, string> = {
      daily: 'bg-[var(--chart-1)]',
      creditCard: 'bg-[var(--chart-2)]',
      special: 'bg-[var(--chart-3)]',
    };


    const summary: CategorySummary[] = (Object.keys(categoryTotals) as CategoryKey[]).map(key => ({
      key,
      name: categoryDisplay(key),
      total: categoryTotals[key],
      percentage: grandTotal > 0 ? (categoryTotals[key] / grandTotal) * 100 : 0,
      colorClass: colors[key],
      legendColorClass: legendColors[key],
    }));
    
    return { summary, grandTotal };
  }, [monthlyExpenses, localizedCategories, categoryDisplay]);


  const handleExport = () => {
    if (monthlyExpenses.length === 0) {
      toast({ title: t('exportNoDataTitle'), description: t('exportNoDataMessage') });
      return;
    }
    const dataToExport = monthlyExpenses.map(exp => ({
      Date: format(parseISO(exp.date), 'yyyy-MM-dd'),
      Amount: exp.amount,
      Category: categoryDisplay(exp.category),
      Subcategory: exp.subcategory || '-', // Assuming subcategoryDisplay was part of old code or needs to be adapted
      Notes: exp.notes || '',
    }));
    exportToCsv(dataToExport, `amma-expenses-${format(currentDate, 'yyyy-MM')}.csv`);
    toast({ title: t('exportSuccessTitle'), description: t('exportSuccessMessage') });
  };
  
  const handleFilter = () => {
    // Placeholder for filter functionality
    toast({title: "Filter Clicked", description: "Filter functionality will be implemented later."});
  }

  return (
    <div className="space-y-6 pb-16 md:pb-8"> {/* Added padding-bottom for action buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={goToPreviousMonth} aria-label={t('previousMonthAriaLabel')}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl md:text-2xl font-semibold text-center">{formattedCurrentMonth}</h2>
        <Button variant="outline" size="icon" onClick={goToNextMonth} aria-label={t('nextMonthAriaLabel')}>
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Monthly Overview Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-headline">{t('monthlyOverviewTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-lg">
          {categorySummaryData.summary.map(cat => (
            <div key={cat.key} className="flex justify-between items-center">
              <span>{cat.name}</span>
              <span className="font-medium">{formatCurrency(cat.total)}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between items-center font-bold text-xl">
            <span>{t('totalExpensesLabel')}</span>
            <span>{formatCurrency(categorySummaryData.grandTotal)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-headline">{t('expenseBreakdownTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categorySummaryData.grandTotal > 0 ? (
            <>
              {categorySummaryData.summary.map(cat => (
                <div key={cat.key} className="space-y-1">
                  <div className="flex justify-between items-center text-md">
                    <span>{cat.name}</span>
                    <span>{cat.percentage.toFixed(0)}%</span>
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cat.colorClass}`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 text-sm">
                {categorySummaryData.summary.map(cat => (
                  <div key={`legend-${cat.key}`} className="flex items-center gap-2">
                    <span className={`inline-block h-3 w-3 rounded-sm ${cat.legendColorClass}`}></span>
                    <span>{cat.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
             <p className="text-center text-muted-foreground text-lg py-4">{t('viewExpensesNoExpenses')}</p>
          )}
        </CardContent>
      </Card>
      
      {/* Action Buttons at the bottom */}
      <div className="fixed bottom-16 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto bg-background md:bg-transparent p-4 md:p-0 border-t md:border-t-0 md:mt-6">
        <div className="container mx-auto md:px-0 flex gap-4">
            <Button variant="outline" className="flex-1 btn-xl" onClick={handleFilter}>
                <Filter className="mr-2 h-5 w-5" /> {t('filterButtonLabel')}
            </Button>
            <Button variant="default" className="flex-1 btn-xl" onClick={handleExport}>
                <Download className="mr-2 h-5 w-5" /> {t('exportButtonLabel')}
            </Button>
        </div>
      </div>
    </div>
  );
}
