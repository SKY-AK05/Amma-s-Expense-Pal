
'use client';

import React, { useState, useMemo } from 'react';
import { useExpenses } from '@/hooks/use-expenses';
import { useI18n } from '@/contexts/i18n-context';
import type { Expense, CategoryKey, Language, SubcategoryKey } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Filter, Download } from 'lucide-react';
import { format, parseISO, addMonths, subMonths, getYear, getMonth } from 'date-fns';
import type { Locale } from 'date-fns';
import { enUS, ta as taDateLocale, hi as hiDateLocale } from 'date-fns/locale';
import { exportToCsv } from '@/utils/export';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
  legendColorClass: string;
}

export default function MonthlySummaryPage() {
  const { expenses } = useExpenses();
  const { t, getLocalizedCategories, getLocalizedSubcategories, language } = useI18n();
  const { toast } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());

  const localizedCategories = getLocalizedCategories();
  const localizedSubcategories = getLocalizedSubcategories();

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


  const handleExportCsv = () => {
    if (monthlyExpenses.length === 0) {
      toast({ title: t('exportNoDataTitle'), description: t('exportNoDataMessage') });
      return;
    }
    const dataToExport = monthlyExpenses.map(exp => ({
      Date: format(parseISO(exp.date), 'yyyy-MM-dd'),
      Amount: exp.amount,
      Category: categoryDisplay(exp.category),
      Subcategory: exp.subcategory ? (localizedSubcategories[exp.subcategory as SubcategoryKey] || exp.subcategory) : '-',
      Notes: exp.notes || '',
    }));
    exportToCsv(dataToExport, `amma-expenses-${format(currentDate, 'yyyy-MM')}.csv`);
    toast({ title: t('exportSuccessTitle'), description: t('exportCsvSuccessMessage') });
  };
  
  const handleExportPdf = () => {
    if (monthlyExpenses.length === 0) {
      toast({ title: t('exportNoDataTitle'), description: t('exportNoDataMessage') });
      return;
    }

    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    let yPos = 20;

    doc.setFontSize(18);
    doc.text(`${t('monthlySummaryTitle')} - ${formattedCurrentMonth}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    doc.setFontSize(14);
    doc.text(t('monthlyOverviewTitle'), 14, yPos);
    yPos += 7;
    
    const overviewTableBody = categorySummaryData.summary.map(cat => [cat.name, formatCurrency(cat.total)]);
    overviewTableBody.push([t('totalExpensesLabel'), formatCurrency(categorySummaryData.grandTotal)]);

    (doc as any).autoTable({
      startY: yPos,
      head: [[t('addExpenseFormCategoryLabel'), t('addExpenseFormAmountLabel')]],
      body: overviewTableBody,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [230, 30, 77], fontSize: 11 }, // primary red-ish
      margin: { left: 14, right: 14 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 10;

    if (categorySummaryData.grandTotal > 0) {
      if (yPos + 40 > pageHeight) { doc.addPage(); yPos = 20; } // Check for page break
      doc.setFontSize(14);
      doc.text(t('expenseBreakdownTitle'), 14, yPos);
      yPos += 7;
      const breakdownTableBody = categorySummaryData.summary.map(cat => [
        cat.name,
        formatCurrency(cat.total),
        `${cat.percentage.toFixed(0)}%`
      ]);
      (doc as any).autoTable({
        startY: yPos,
        head: [[t('addExpenseFormCategoryLabel'), t('addExpenseFormAmountLabel'), '%']],
        body: breakdownTableBody,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [230, 30, 77], fontSize: 11 },
        margin: { left: 14, right: 14 },
      });
      yPos = (doc as any).lastAutoTable.finalY + 10;
    }

    if (monthlyExpenses.length > 0) {
      if (yPos + 40 > pageHeight) { doc.addPage(); yPos = 20; } // Check for page break
      doc.setFontSize(14);
      doc.text(t('homeRecentTransactionsTitle'), 14, yPos);
      yPos += 7;
      const transactionsTableBody = monthlyExpenses.map(exp => [
        format(parseISO(exp.date), 'yyyy-MM-dd'),
        categoryDisplay(exp.category),
        exp.subcategory ? (localizedSubcategories[exp.subcategory as SubcategoryKey] || exp.subcategory) : '-',
        formatCurrency(exp.amount),
        exp.notes || '',
      ]);

      (doc as any).autoTable({
        startY: yPos,
        head: [[t('addExpenseFormDateLabel'), t('addExpenseFormCategoryLabel'), t('addExpenseFormSubcategoryLabel'), t('addExpenseFormAmountLabel'), t('addExpenseFormNotesLabel')]],
        body: transactionsTableBody,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 1.5 },
        headStyles: { fillColor: [230, 30, 77], fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 23 }, // Date
          1: { cellWidth: 28 }, // Category
          2: { cellWidth: 28 }, // Subcategory
          3: { cellWidth: 22, halign: 'right' }, // Amount
          4: { cellWidth: 'auto' }, // Notes - remaining width
        },
        margin: { left: 14, right: 14 },
      });
    }

    doc.save(`Amma-Expense-Summary-${format(currentDate, 'yyyy-MM')}.pdf`);
    toast({ title: t('exportSuccessTitle'), description: t('exportPdfSuccessMessage') });
  };

  const handleFilter = () => {
    toast({title: "Filter Clicked", description: "Filter functionality will be implemented later."});
  }

  return (
    <div className="space-y-6 pb-16 md:pb-8">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={goToPreviousMonth} aria-label={t('previousMonthAriaLabel')}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl md:text-2xl font-semibold text-center">{formattedCurrentMonth}</h2>
        <Button variant="outline" size="icon" onClick={goToNextMonth} aria-label={t('nextMonthAriaLabel')}>
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

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
      
      <div className="fixed bottom-16 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto bg-background md:bg-transparent p-4 md:p-0 border-t md:border-t-0 md:mt-6">
        <div className="container mx-auto md:px-0 flex gap-4">
            <Button variant="outline" className="flex-1 btn-xl" onClick={handleFilter}>
                <Filter className="mr-2 h-5 w-5" /> {t('filterButtonLabel')}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" className="flex-1 btn-xl">
                  <Download className="mr-2 h-5 w-5" /> {t('exportButtonLabel')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportCsv}>
                  {t('exportCsvButtonLabel')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPdf}>
                  {t('exportPdfButtonLabel')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
