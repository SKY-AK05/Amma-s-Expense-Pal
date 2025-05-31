
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useExpenses } from '@/hooks/use-expenses';
import { useI18n } from '@/contexts/i18n-context';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Lightbulb, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { Locale } from 'date-fns';
import { enUS, ta as taDateLocale, hi as hiDateLocale } from 'date-fns/locale';
import type { Expense, CategoryKey, SubcategoryKey, Language } from '@/types';
import { suggestExpenseCategories, SuggestExpenseCategoriesInput } from '@/ai/flows/suggest-expense-categories';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

const expenseSchema = z.object({
  date: z.date({ required_error: 'Date is required.' }),
  amount: z.coerce.number().positive({ message: 'Amount must be positive.' }),
  category: z.enum(['daily', 'creditCard', 'special'], { required_error: 'Category is required.' }),
  subcategory: z.string().optional(),
  notes: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  expenseToEdit?: Expense;
  onSuccess?: () => void;
}

const dateLocales: Record<Language, Locale> = {
  en: enUS,
  ta: taDateLocale,
  hi: hiDateLocale,
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expenseToEdit, onSuccess }) => {
  const { addExpense, updateExpense } = useExpenses();
  const { t, getLocalizedCategories, getLocalizedSubcategories, language } = useI18n();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);


  const defaultValues = expenseToEdit
    ? {
        date: parseISO(expenseToEdit.date),
        amount: expenseToEdit.amount,
        category: expenseToEdit.category,
        subcategory: expenseToEdit.subcategory,
        notes: expenseToEdit.notes,
      }
    : {
        date: new Date(),
        amount: undefined,
        category: undefined,
        subcategory: undefined,
        notes: '',
      };

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues,
  });

  const selectedCategory = watch('category');
  const notesForAI = watch('notes');

  const categories = getLocalizedCategories();
  const subcategories = getLocalizedSubcategories();

  const categoryOptions = Object.entries(categories).map(([key, value]) => ({
    value: key as CategoryKey,
    label: value,
  }));

  const subcategoryOptions = Object.entries(subcategories)
    .filter(([key]) => key !== 'custom') // 'custom' might be handled differently or just be a string
    .map(([key, value]) => ({
      value: key as SubcategoryKey,
      label: value,
    }));

  const onSubmit = (data: ExpenseFormData) => {
    setIsSubmitting(true);
    const expensePayload = {
      ...data,
      date: data.date.toISOString(),
      amount: Number(data.amount)
    };

    try {
      if (expenseToEdit) {
        updateExpense(expenseToEdit.id, expensePayload);
      } else {
        addExpense(expensePayload);
      }
      toast({ title: t('addExpenseSuccessToast') });
      if (onSuccess) onSuccess();
      // Reset form if not editing
      if (!expenseToEdit) {
         setValue('date', new Date());
         setValue('amount', 0);
         setValue('category', 'daily');
         setValue('subcategory', undefined);
         setValue('notes', '');
         setAiSuggestions([]);
      }
    } catch (error) {
      console.error("Failed to save expense", error);
      toast({ title: "Error", description: "Failed to save expense.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSuggestCategory = async () => {
    if (!notesForAI || notesForAI.trim() === "") {
      toast({ title: "Info", description: "Please enter some notes to get suggestions.", variant: "default" });
      return;
    }
    setIsSuggesting(true);
    setAiSuggestions([]);
    try {
      const input: SuggestExpenseCategoriesInput = { notes: notesForAI };
      const result = await suggestExpenseCategories(input);
      if (result && result.categories) {
        setAiSuggestions(result.categories);
      } else {
         toast({ title: t('aiSuggestionError'), variant: 'destructive' });
      }
    } catch (error) {
      console.error("AI suggestion error:", error);
      toast({ title: t('aiSuggestionError'), variant: 'destructive' });
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="date" className="block text-lg font-medium mb-1">{t('addExpenseFormDateLabel')}</label>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal input-xl"
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {field.value ? format(field.value, 'PPP', { locale: dateLocales[language] }) : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.date && <p className="text-destructive mt-1">{errors.date.message}</p>}
      </div>

      <div>
        <label htmlFor="amount" className="block text-lg font-medium mb-1">{t('addExpenseFormAmountLabel')}</label>
        <Controller
          name="amount"
          control={control}
          render={({ field }) => <Input {...field} type="number" step="0.01" className="input-xl" onChange={e => field.onChange(parseFloat(e.target.value))}/>}
        />
        {errors.amount && <p className="text-destructive mt-1">{errors.amount.message}</p>}
      </div>

      <div>
        <label htmlFor="category" className="block text-lg font-medium mb-1">{t('addExpenseFormCategoryLabel')}</label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
              <SelectTrigger className="input-xl select-trigger-xl">
                <SelectValue placeholder={t('selectPlaceholder')} />
              </SelectTrigger>
              <SelectContent className="select-content-xl">
                {categoryOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value} className="select-item-xl">{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category && <p className="text-destructive mt-1">{errors.category.message}</p>}
      </div>

      {selectedCategory === 'special' && (
        <div>
          <label htmlFor="subcategory" className="block text-lg font-medium mb-1">{t('addExpenseFormSubcategoryLabel')}</label>
          <Controller
            name="subcategory"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <SelectTrigger className="input-xl select-trigger-xl">
                  <SelectValue placeholder={t('selectPlaceholder')} />
                </SelectTrigger>
                <SelectContent className="select-content-xl">
                  {subcategoryOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value} className="select-item-xl">{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {/* Add input for custom subcategory if needed */}
        </div>
      )}
      
      <div>
        <label htmlFor="notes" className="block text-lg font-medium mb-1">{t('addExpenseFormNotesLabel')}</label>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder={t('addExpenseFormNotesPlaceholder')}
              className="min-h-[100px] text-lg"
            />
          )}
        />
      </div>

      <Button type="button" variant="outline" onClick={handleSuggestCategory} disabled={isSuggesting} className="w-full btn-xl">
        {isSuggesting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Lightbulb className="mr-2 h-5 w-5" />}
        {t('addExpenseFormSuggestCategoryButton')}
      </Button>

      {aiSuggestions.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-xl">{t('aiSuggestionsTitle')}</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {aiSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-lg"
                onClick={() => {
                  // Heuristic to map suggestion to existing categories
                  const lowerSuggestion = suggestion.toLowerCase();
                  let matchedCategory: CategoryKey | undefined = undefined;
                  if (lowerSuggestion.includes('food') || lowerSuggestion.includes('grocery') || lowerSuggestion.includes('daily')) matchedCategory = 'daily';
                  else if (lowerSuggestion.includes('card') || lowerSuggestion.includes('credit')) matchedCategory = 'creditCard';
                  else if (lowerSuggestion.includes('gift') || lowerSuggestion.includes('special') || lowerSuggestion.includes('marriage') || lowerSuggestion.includes('birthday')) matchedCategory = 'special';
                  
                  if (matchedCategory) setValue('category', matchedCategory);
                  else {
                     // if no direct match, try to set as notes or a custom subcategory if 'special' is chosen
                     if (selectedCategory === 'special') setValue('subcategory', suggestion);
                  }
                  toast({ title: `Set category based on: ${suggestion}` });
                }}
              >
                {suggestion}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      <Button type="submit" className="w-full btn-xl" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
        {t('addExpenseFormSaveButton')}
      </Button>
    </form>
  );
};

export default ExpenseForm;

    