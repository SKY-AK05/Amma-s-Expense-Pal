
'use client';

import React from 'react';
import { useI18n } from '@/contexts/i18n-context';
import type { Language, Expense, CategoryKey, SubcategoryKey } from '@/types';
import { useExpenses } from '@/hooks/use-expenses';
import { useToast } from '@/hooks/use-toast';
import { exportToCsv } from '@/utils/export';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format, parseISO } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages, Moon, Download, Share2, Trash2, HelpCircle, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  const { t, language, setLanguage, theme, toggleTheme, getLocalizedCategories, getLocalizedSubcategories } = useI18n();
  const { expenses, setExpenses: clearAllExpensesHook } = useExpenses();
  const { toast } = useToast();

  const localizedCategories = getLocalizedCategories();
  const localizedSubcategories = getLocalizedSubcategories();

  const categoryDisplay = (categoryKey: CategoryKey) => localizedCategories[categoryKey] || categoryKey;
  const subcategoryDisplay = (subcategoryKey: SubcategoryKey | string) => {
    if (['gift', 'marriage', 'birthday', 'custom'].includes(subcategoryKey as SubcategoryKey)) {
       return localizedSubcategories[subcategoryKey as SubcategoryKey] || subcategoryKey;
    }
    return subcategoryKey;
  };


  const languageOptions = [
    { value: 'en', label: t('settingsLanguageEnglish') },
    { value: 'ta', label: t('settingsLanguageTamil') },
    { value: 'hi', label: t('settingsLanguageHindi') },
  ];

  const handleExportAllCsv = () => {
    if (expenses.length === 0) {
      toast({ title: t('settingsExportAllNoDataTitle'), description: t('settingsExportAllNoDataMessage') });
      return;
    }
    const dataToExport = expenses.map(exp => ({
      Date: format(parseISO(exp.date), 'yyyy-MM-dd'),
      Amount: exp.amount,
      Category: categoryDisplay(exp.category),
      Subcategory: exp.subcategory ? subcategoryDisplay(exp.subcategory) : '-',
      Notes: exp.notes || '',
      CreatedAt: format(parseISO(exp.createdAt), 'yyyy-MM-dd HH:mm:ss'),
    }));
    exportToCsv(dataToExport, `amma-all-expenses-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    toast({ title: t('settingsExportAllSuccessTitle'), description: t('settingsExportAllCsvSuccessMessage') });
  };

  const handleExportAllPdf = () => {
    if (expenses.length === 0) {
      toast({ title: t('settingsExportAllNoDataTitle'), description: t('settingsExportAllNoDataMessage') });
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(t('appName') + " - " + t('settingsExportAllDataLabel'), 14, 20);
    yPos = 30;

    const transactionsTableBody = expenses.map(exp => [
      format(parseISO(exp.date), 'yyyy-MM-dd'),
      categoryDisplay(exp.category),
      exp.subcategory ? subcategoryDisplay(exp.subcategory) : '-',
      new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(exp.amount),
      exp.notes || '',
    ]);

    (doc as any).autoTable({
      startY: yPos,
      head: [[t('addExpenseFormDateLabel'), t('addExpenseFormCategoryLabel'), t('addExpenseFormSubcategoryLabel'), t('addExpenseFormAmountLabel'), t('addExpenseFormNotesLabel')]],
      body: transactionsTableBody,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 1.5 },
      headStyles: { fillColor: [230, 30, 77], fontSize: 9 }, // primary red-ish
      columnStyles: {
        0: { cellWidth: 23 }, // Date
        1: { cellWidth: 28 }, // Category
        2: { cellWidth: 28 }, // Subcategory
        3: { cellWidth: 22, halign: 'right' }, // Amount
        4: { cellWidth: 'auto' }, // Notes
      },
      margin: { left: 14, right: 14 },
    });

    doc.save(`Amma-All-Expenses-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    toast({ title: t('settingsExportAllSuccessTitle'), description: t('settingsExportAllPdfSuccessMessage') });
  };
  
  let yPos = 20; // for PDF generation

  const handleShareApp = async () => {
    const shareData = {
      title: t('appName'),
      text: t('settingsShareAppMessage'),
      url: window.location.origin,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast({ title: t('settingsShareAppLabel'), description: t('settingsShareAppError', {url: shareData.url}) });
      }
    } catch (err) {
      console.error('Error sharing app:', err);
      toast({ title: t('settingsShareAppError', {url: shareData.url}), variant: 'destructive' });
    }
  };

  const handleClearAllData = () => {
    clearAllExpensesHook([]);
    toast({ title: t('settingsClearAllDataSuccessToast') });
  };

  const handleHelpSupport = () => {
    toast({ title: t('settingsHelpSupportLabel'), description: t('settingsHelpSupportToast'), duration: 5000 });
  };

  const SettingItem: React.FC<{icon: React.ElementType, label: string, children?: React.ReactNode, onClick?: () => void, isDestructive?: boolean}> = 
    ({ icon: Icon, label, children, onClick, isDestructive }) => (
    <div
      className={`flex items-center justify-between py-4 px-1 ${onClick ? 'cursor-pointer hover:bg-muted/50 -mx-1 px-1 rounded-md' : ''} ${isDestructive ? 'text-destructive' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <Icon className={`mr-3 h-6 w-6 ${isDestructive ? 'text-destructive': 'text-muted-foreground'}`} />
        <span className="text-lg">{label}</span>
      </div>
      {children}
    </div>
  );


  return (
    <div className="max-w-2xl mx-auto pb-8">
      <Card className="shadow-none border-0 md:border md:shadow-lg">
        <CardHeader className="px-1 md:px-6 pt-2 md:pt-6">
          <CardTitle className="text-3xl font-headline text-left md:text-center">{t('settingsTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-1 md:px-6">
          
          {/* Preferences Section */}
          <div>
            <h3 className="text-xl font-semibold mt-2 mb-0 text-muted-foreground">{t('settingsPreferencesTitle')}</h3>
            <Separator className="my-2" />
            <SettingItem icon={Languages} label={t('settingsLanguageLabel')}>
              <Select
                value={language}
                onValueChange={(value) => setLanguage(value as Language)}
              >
                <SelectTrigger id="language-select" className="w-auto input-xl select-trigger-xl border-0 text-lg text-right p-0 h-auto focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder={t('selectPlaceholder')} />
                </SelectTrigger>
                <SelectContent className="select-content-xl">
                  {languageOptions.map(option => (
                    <SelectItem key={option.value} value={option.value} className="select-item-xl">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingItem>
            <Separator className="my-0" />
            <SettingItem icon={Moon} label={t('settingsDarkModeLabel')}>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
                aria-label={t('settingsDarkModeLabel')}
              />
            </SettingItem>
          </div>

          {/* Data Management Section */}
          <div>
            <h3 className="text-xl font-semibold mt-6 mb-0 text-muted-foreground">{t('settingsDataManagementTitle')}</h3>
            <Separator className="my-2" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SettingItem icon={Download} label={t('settingsExportAllDataLabel')} onClick={() => { /* Dropdown handles click */ }}>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </SettingItem>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="select-content-xl">
                <DropdownMenuItem onClick={handleExportAllCsv} className="select-item-xl">
                  {t('settingsExportAllDataCsvLabel')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportAllPdf} className="select-item-xl">
                  {t('settingsExportAllDataPdfLabel')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Separator className="my-0" />
            <SettingItem icon={Share2} label={t('settingsShareAppLabel')} onClick={handleShareApp}>
               <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </SettingItem>
            <Separator className="my-0" />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <SettingItem icon={Trash2} label={t('settingsClearAllDataLabel')} isDestructive>
                  <ChevronRight className="h-5 w-5 text-destructive" />
                </SettingItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('settingsClearAllDataConfirmTitle')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('settingsClearAllDataConfirmMessage')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="btn-xl">{t('settingsClearAllDataCancelButton')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAllData} className="btn-xl bg-destructive hover:bg-destructive/90">
                    {t('settingsClearAllDataConfirmButton')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-xl font-semibold mt-6 mb-0 text-muted-foreground">{t('settingsSupportTitle')}</h3>
            <Separator className="my-2" />
            <SettingItem icon={HelpCircle} label={t('settingsHelpSupportLabel')} onClick={handleHelpSupport}>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </SettingItem>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
