
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useExpenses } from '@/hooks/use-expenses';
import { useI18n } from '@/contexts/i18n-context';
import type { Expense, CategoryKey, Language } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, ArrowUpDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { Locale } from 'date-fns';
import { enUS, ta as taDateLocale, hi as hiDateLocale } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { exportToCsv } from '@/utils/export';
import { useToast } from '@/hooks/use-toast';

type SortKey = 'date' | 'amount';
type SortOrder = 'asc' | 'desc';

const dateLocales: Record<Language, Locale> = {
  en: enUS,
  ta: taDateLocale,
  hi: hiDateLocale,
};

export default function ViewExpensesPage() {
  const { expenses, deleteExpense } = useExpenses();
  const { t, getLocalizedCategories, getLocalizedSubcategories, language } = useI18n();
  const router = useRouter();
  const { toast } = useToast();

  const [filterCategory, setFilterCategory] = useState<CategoryKey | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const localizedCategories = getLocalizedCategories();
  const localizedSubcategories = getLocalizedSubcategories();

  const categoryDisplay = (categoryKey: CategoryKey) => localizedCategories[categoryKey] || categoryKey;
  const subcategoryDisplay = (subcategoryKey?: string) => {
    if (!subcategoryKey) return '-';
    return localizedSubcategories[subcategoryKey] || subcategoryKey; // For custom strings
  }


  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...expenses];

    if (filterCategory !== 'all') {
      result = result.filter(expense => expense.category === filterCategory);
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortKey === 'amount') {
        comparison = a.amount - b.amount;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [expenses, filterCategory, sortKey, sortOrder]);

  const handleEdit = (id: string) => {
    router.push(`/add-expense?edit=${id}`); // Or use a modal/dialog for editing
  };
  
  const handleDelete = (id: string) => {
    deleteExpense(id);
    toast({ title: "Expense Deleted", description: "The expense has been removed."});
  };

  const handleExport = () => {
    const dataToExport = filteredAndSortedExpenses.map(exp => ({
      Date: format(parseISO(exp.date), 'yyyy-MM-dd'),
      Amount: exp.amount,
      Category: categoryDisplay(exp.category),
      Subcategory: subcategoryDisplay(exp.subcategory),
      Notes: exp.notes || '',
    }));
    exportToCsv(dataToExport, `amma-expenses-${new Date().toISOString().split('T')[0]}.csv`);
    toast({title: "Exported!", description: "Expenses exported to CSV."});
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  }

  const handleSortKeyChange = (key: SortKey) => {
    if (sortKey === key) {
      toggleSortOrder();
    } else {
      setSortKey(key);
      setSortOrder('desc'); // Default to descending for new sort key
    }
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-headline">{t('viewExpensesTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
            <div className="flex-1 w-full md:w-auto">
              <label className="block text-lg font-medium mb-1">{t('viewExpensesFilterByCategoryLabel')}</label>
              <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as CategoryKey | 'all')}>
                <SelectTrigger className="input-xl select-trigger-xl">
                  <SelectValue placeholder={t('selectPlaceholder')} />
                </SelectTrigger>
                <SelectContent className="select-content-xl">
                  <SelectItem value="all" className="select-item-xl">{t('viewExpensesFilterAllCategories')}</SelectItem>
                  {Object.entries(localizedCategories).map(([key, value]) => (
                    <SelectItem key={key} value={key} className="select-item-xl">{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleExport} variant="outline" className="w-full md:w-auto btn-xl self-end">{t('viewExpensesExportButton')}</Button>
          </div>

          {filteredAndSortedExpenses.length === 0 ? (
             <p className="text-center text-muted-foreground text-xl py-8">{t('viewExpensesNoExpenses')}</p>
          ) : (
            <div className="overflow-x-auto">
              <Table className="text-lg">
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSortKeyChange('date')} className="cursor-pointer">
                      {t('viewExpensesTableDateHeader')} {sortKey === 'date' && <ArrowUpDown className="inline ml-1 h-4 w-4" />}
                    </TableHead>
                    <TableHead onClick={() => handleSortKeyChange('amount')} className="cursor-pointer text-right">
                      {t('viewExpensesTableAmountHeader')} {sortKey === 'amount' && <ArrowUpDown className="inline ml-1 h-4 w-4" />}
                    </TableHead>
                    <TableHead>{t('viewExpensesTableCategoryHeader')}</TableHead>
                    <TableHead>{t('viewExpensesTableSubcategoryHeader')}</TableHead>
                    <TableHead>{t('viewExpensesTableNotesHeader')}</TableHead>
                    <TableHead>{t('viewExpensesTableActionsHeader')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{format(parseISO(expense.date), 'PP', { locale: dateLocales[language] })}</TableCell>
                      <TableCell className="text-right font-medium">{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(expense.amount)}</TableCell>
                      <TableCell>{categoryDisplay(expense.category)}</TableCell>
                      <TableCell>{subcategoryDisplay(expense.subcategory)}</TableCell>
                      <TableCell className="max-w-xs truncate">{expense.notes || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                           {/* Edit functionality will be added later if time permits by prefilling ExpenseForm */}
                           {/* <Button variant="ghost" size="icon" onClick={() => handleEdit(expense.id)} aria-label={t('viewExpensesEditButton')}>
                            <Edit className="h-5 w-5" />
                          </Button> */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" aria-label={t('viewExpensesDeleteButton')}>
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('deleteConfirmationTitle')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('deleteConfirmationMessage')}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('deleteConfirmationCancelButton')}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(expense.id)} className="bg-destructive hover:bg-destructive/90">
                                  {t('deleteConfirmationConfirmButton')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    