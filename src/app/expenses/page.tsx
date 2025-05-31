
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useExpenses } from '@/hooks/use-expenses';
import { useI18n } from '@/contexts/i18n-context';
import type { Expense, CategoryKey, Language, SubcategoryKey } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { Locale } from 'date-fns';
import { enUS, ta as taDateLocale, hi as hiDateLocale } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

const dateLocales: Record<Language, Locale> = {
  en: enUS,
  ta: taDateLocale,
  hi: hiDateLocale,
};

type FilterValue = 'all' | CategoryKey;

export default function ExpensesPage() {
  const { t, getLocalizedCategories, getLocalizedSubcategories, language } = useI18n();
  const { expenses, deleteExpense } = useExpenses();
  const router = useRouter();
  const { toast } = useToast();

  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const localizedCategories = getLocalizedCategories();
  const localizedSubcategories = getLocalizedSubcategories();

  const categoryDisplay = (categoryKey: CategoryKey) => localizedCategories[categoryKey] || categoryKey;
  const subcategoryDisplay = (subcategoryKey: SubcategoryKey | string) => {
    if (Object.prototype.hasOwnProperty.call(localizedSubcategories, subcategoryKey)) {
       return localizedSubcategories[subcategoryKey as SubcategoryKey] || subcategoryKey;
    }
    return subcategoryKey;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  };

  const filteredExpenses = useMemo(() => {
    const sortedExpenses = [...expenses].sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
    if (activeFilter === 'all') {
      return sortedExpenses;
    }
    return sortedExpenses.filter(expense => expense.category === activeFilter);
  }, [expenses, activeFilter]);

  const filterButtons: { labelKey: string; value: FilterValue }[] = [
    { labelKey: 'expensesFilterAll', value: 'all' },
    { labelKey: 'categoryDaily', value: 'daily' },
    { labelKey: 'categoryCreditCard', value: 'creditCard' },
    { labelKey: 'categorySpecial', value: 'special' },
  ];

  const handleDeleteConfirm = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete.id);
      toast({ 
        title: t('deleteExpenseSuccessToastTitle'), 
        description: t('deleteExpenseSuccessToastMessage', { 
          category: categoryDisplay(expenseToDelete.category), 
          amount: formatCurrency(expenseToDelete.amount) 
        }) 
      });
      setExpenseToDelete(null);
    }
  };

  return (
    <div className="space-y-6 pb-16 md:pb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-headline font-bold">{t('navExpenses')}</h1>
        <Link href="/add-expense" passHref>
          <Button size="lg" className="w-full md:w-auto btn-xl">
            <PlusCircle className="mr-2 h-6 w-6" /> {t('expensesAddNewButton')}
          </Button>
        </Link>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline">{t('expensesFilterTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {filterButtons.map(fb => (
            <Button
              key={fb.value}
              variant={activeFilter === fb.value ? 'default' : 'outline'}
              onClick={() => setActiveFilter(fb.value)}
              className="btn-xl"
            >
              {t(fb.labelKey)}
            </Button>
          ))}
        </CardContent>
      </Card>

      {filteredExpenses.length > 0 ? (
        <ul className="space-y-4">
          {filteredExpenses.map(expense => (
            <li key={expense.id} className="p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div className="flex-grow min-w-0"> {/* Added min-w-0 fornotes truncation */}
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(expense.date), 'PPP', { locale: dateLocales[language] })}
                  </p>
                  <p className="font-semibold text-xl text-primary my-1">
                    {formatCurrency(expense.amount)}
                  </p>
                  <div className="flex items-center gap-2 text-md flex-wrap">
                    <span className="font-medium">{categoryDisplay(expense.category)}</span>
                    {expense.subcategory && (
                      <>
                        <span className="text-muted-foreground">&middot;</span>
                        <span>{subcategoryDisplay(expense.subcategory)}</span>
                      </>
                    )}
                  </div>
                  {expense.notes && (
                    <p className="text-sm text-foreground/80 mt-1 truncate" title={expense.notes}>
                      {expense.notes}
                    </p>
                  )}
                </div>
                <div className="flex sm:flex-col gap-2 shrink-0 pt-1">
                   <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto text-base py-2 px-3" // Adjusted size
                    onClick={() => router.push(`/add-expense?edit=${expense.id}`)}
                  >
                    <Pencil className="mr-1.5 h-4 w-4" /> {t('modifyButtonLabel')}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full sm:w-auto text-base py-2 px-3" // Adjusted size
                    onClick={() => setExpenseToDelete(expense)}
                  >
                    <Trash2 className="mr-1.5 h-4 w-4" /> {t('deleteButtonLabel')}
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">{t('expensesNoExpensesForFilterMessage')}</p>
          {activeFilter !== 'all' && (
             <Button variant="link" onClick={() => setActiveFilter('all')} className="mt-2 text-lg">
              {t('expensesShowAllButton')}
            </Button>
          )}
        </div>
      )}

      {expenseToDelete && (
        <AlertDialog open={!!expenseToDelete} onOpenChange={(open) => !open && setExpenseToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('deleteConfirmationTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('deleteConfirmationMessage')}
                <br />
                <strong className="block mt-2 text-center">{categoryDisplay(expenseToDelete.category)} - {formatCurrency(expenseToDelete.amount)} ({format(parseISO(expenseToDelete.date), 'PP', { locale: dateLocales[language] })})</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setExpenseToDelete(null)} className="btn-xl">{t('deleteConfirmationCancelButton')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="btn-xl bg-destructive hover:bg-destructive/90">
                {t('deleteConfirmationConfirmButton')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
