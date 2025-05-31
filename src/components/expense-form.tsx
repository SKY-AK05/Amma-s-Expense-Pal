
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useExpenses } from '@/hooks/use-expenses';
import { useI18n } from '@/contexts/i18n-context';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Loader2, CreditCard, Gift, Coffee, CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { Locale } from 'date-fns';
import { enUS, ta as taDateLocale, hi as hiDateLocale } from 'date-fns/locale';
import type { Expense, CategoryKey, SubcategoryKey, Language } from '@/types';
import { suggestExpenseCategories, SuggestExpenseCategoriesInput } from '@/ai/flows/suggest-expense-categories';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const dateLocales: Record<Language, Locale> = {
  en: enUS,
  ta: taDateLocale,
  hi: hiDateLocale,
};

const categoryIcons: Record<CategoryKey, React.ElementType> = {
  daily: Coffee,
  creditCard: CreditCard,
  special: Gift,
};

const ExpenseForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { addExpense, updateExpense, getExpenseById } = useExpenses();
  const { t, language, getLocalizedCategories, getLocalizedSubcategories } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const expenseSchema = z.object({
    date: z.date({ required_error: t('addExpenseFormDateLabel') + ' is required.' }),
    amount: z.coerce.number().positive({ message: t('addExpenseFormAmountLabel') + ' must be positive.' }),
    category: z.enum(['daily', 'creditCard', 'special'], { required_error: t('addExpenseFormCategoryLabel') + ' is required.' }),
    subcategory: z.string().optional(),
    customSubcategory: z.string().optional(),
    notes: z.string().optional(),
  }).superRefine((data, ctx) => {
    if (data.category === 'special' && data.subcategory === 'custom') {
      if (!data.customSubcategory || data.customSubcategory.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('customSubcategoryRequiredError'),
          path: ['customSubcategory'],
        });
      }
    }
  });
  
  type ExpenseFormData = z.infer<typeof expenseSchema>;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const initialCategoryFromQuery = useMemo(() => {
    const category = searchParams.get('category');
    if (category && ['daily', 'creditCard', 'special'].includes(category)) {
      return category as CategoryKey;
    }
    return undefined;
  }, [searchParams]);

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      const expense = getExpenseById(editId);
      setExpenseToEdit(expense);
    } else {
      setExpenseToEdit(undefined);
    }
  }, [searchParams, getExpenseById]);

  const defaultValues = useMemo(() => {
    if (expenseToEdit) {
      const isPredefinedSubcategory = expenseToEdit.subcategory && 
        ['gift', 'marriage', 'birthday'].includes(expenseToEdit.subcategory as SubcategoryKey);
      
      const subCatValue = expenseToEdit.category === 'special' 
        ? (isPredefinedSubcategory ? expenseToEdit.subcategory : 'custom')
        : expenseToEdit.subcategory;
      
      const customSubCatValue = expenseToEdit.category === 'special' && !isPredefinedSubcategory
        ? expenseToEdit.subcategory
        : undefined;

      return {
        date: parseISO(expenseToEdit.date),
        amount: expenseToEdit.amount,
        category: expenseToEdit.category,
        subcategory: subCatValue,
        customSubcategory: customSubCatValue,
        notes: expenseToEdit.notes || '',
      };
    }
    return {
      date: new Date(),
      amount: undefined,
      category: initialCategoryFromQuery,
      subcategory: undefined,
      customSubcategory: undefined,
      notes: '',
    };
  }, [expenseToEdit, initialCategoryFromQuery]);

  const { control, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues,
  });
  
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const selectedCategory = watch('category');
  const selectedSubcategory = watch('subcategory');
  const notesForAI = watch('notes');

  const categories = useMemo(() => getLocalizedCategories(), [getLocalizedCategories]);
  const subcategories = useMemo(() => getLocalizedSubcategories(), [getLocalizedSubcategories]);


  const categoryOptions = Object.entries(categories).map(([key, value]) => ({
    value: key as CategoryKey,
    label: value,
    Icon: categoryIcons[key as CategoryKey],
  }));
  
  const subcategoryOptions = Object.entries(subcategories).map(([key, value]) => ({
    value: key as SubcategoryKey,
    label: value,
  }));


  const onSubmit = (data: ExpenseFormData) => {
    setIsSubmitting(true);
    let finalSubcategory = data.subcategory;
    if (data.category === 'special' && data.subcategory === 'custom') {
      finalSubcategory = data.customSubcategory;
    }

    const expensePayload = {
      date: data.date.toISOString(),
      amount: Number(data.amount),
      category: data.category,
      subcategory: finalSubcategory,
      notes: data.notes,
    };

    try {
      if (expenseToEdit) {
        updateExpense(expenseToEdit.id, expensePayload);
        toast({ title: t('addExpenseSuccessToast').replace(t('addExpenseSuccessToast').split(" ")[1], t('addExpenseFormSaveButton').split(" ")[1] || "updated" )}); 
        router.push('/view-expenses'); 
      } else {
        addExpense(expensePayload);
        toast({ title: t('addExpenseSuccessToast') });
        
        const resetCategory = initialCategoryFromQuery && ['daily', 'creditCard', 'special'].includes(initialCategoryFromQuery)
          ? initialCategoryFromQuery
          : undefined;
        reset({
          date: new Date(),
          amount: undefined,
          category: resetCategory,
          subcategory: undefined,
          customSubcategory: undefined,
          notes: '',
        });
        setAiSuggestions([]);
      }
      if (onSuccess && !expenseToEdit) onSuccess(); 
      
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
        <label htmlFor="date-popover-trigger" className="block text-lg font-medium mb-1">{t('addExpenseFormDateLabel')}</label>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="date-popover-trigger"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal input-xl",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {field.value ? format(field.value, 'PPP', { locale: dateLocales[language] }) : <span>{t('pickADatePlaceholder')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value instanceof Date ? field.value : undefined}
                  onSelect={(date) => {
                    field.onChange(date);
                    setIsCalendarOpen(false);
                  }}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  initialFocus
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
          render={({ field }) => <Input {...field} type="number" placeholder="0.00" step="0.01" className="input-xl" value={field.value === undefined ? '' : field.value} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}/>}
        />
        {errors.amount && <p className="text-destructive mt-1">{errors.amount.message}</p>}
      </div>

      <div>
        <label className="block text-lg font-medium mb-1">{t('addExpenseFormCategoryLabel')}</label>
        <div className="grid grid-cols-3 gap-2">
          {categoryOptions.map((opt) => {
            const Icon = opt.Icon || Coffee; 
            return (
            <Button
              key={opt.value}
              type="button"
              variant={selectedCategory === opt.value ? 'default' : 'outline'}
              onClick={() => {
                setValue('category', opt.value, { shouldValidate: true });
                if (opt.value !== 'special') {
                  setValue('subcategory', undefined); 
                  setValue('customSubcategory', undefined);
                }
              }}
              className={cn("btn-xl justify-start text-left h-auto py-3", 
                           selectedCategory === opt.value ? "ring-2 ring-primary-foreground ring-offset-2 ring-offset-primary" : ""
              )}
            >
              <Icon className="mr-2 h-6 w-6" />
              <span className="flex-1">{opt.label}</span>
            </Button>
          );
        })}
        </div>
        {errors.category && <p className="text-destructive mt-1">{errors.category.message}</p>}
      </div>

      {selectedCategory === 'special' && (
        <>
          <div>
            <label htmlFor="subcategory" className="block text-lg font-medium mb-1">{t('addExpenseFormSubcategoryLabel')}</label>
            <Controller
              name="subcategory"
              control={control}
              render={({ field }) => (
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (value !== 'custom') {
                      setValue('customSubcategory', undefined);
                    }
                  }} 
                  value={field.value || ''}
                >
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
          </div>

          {selectedSubcategory === 'custom' && (
            <div>
              <label htmlFor="customSubcategory" className="block text-lg font-medium mb-1">{t('addExpenseFormCustomSubcategoryLabel')}</label>
              <Controller
                name="customSubcategory"
                control={control}
                render={({ field }) => <Input {...field} type="text" placeholder={t('addExpenseFormCustomSubcategoryLabel')} className="input-xl" value={field.value || ''} />}
              />
              {errors.customSubcategory && <p className="text-destructive mt-1">{errors.customSubcategory.message}</p>}
            </div>
          )}
        </>
      )}
      
      <div>
        <label htmlFor="notes" className="block text-lg font-medium mb-1">{t('addExpenseFormNotesLabel')}</label>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              value={field.value || ''}
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
                  const lowerSuggestion = suggestion.toLowerCase();
                  let matchedCategory: CategoryKey | undefined = undefined;
                  
                  if (lowerSuggestion.includes('food') || lowerSuggestion.includes('grocery') || lowerSuggestion.includes('daily')) matchedCategory = 'daily';
                  else if (lowerSuggestion.includes('card') || lowerSuggestion.includes('credit')) matchedCategory = 'creditCard';
                  else if (lowerSuggestion.includes('gift') || lowerSuggestion.includes('special') || lowerSuggestion.includes('marriage') || lowerSuggestion.includes('birthday')) matchedCategory = 'special';
                  
                  if (matchedCategory) setValue('category', matchedCategory);

                  if (matchedCategory === 'special') { // Use matchedCategory here
                    const predefinedSubcategoriesLabels = subcategoryOptions.filter(opt => opt.value !== 'custom').map(opt => opt.label.toLowerCase());
                    const matchedSub = subcategoryOptions.find(opt => opt.label.toLowerCase() === lowerSuggestion);

                    if (matchedSub && predefinedSubcategoriesLabels.includes(lowerSuggestion)) {
                      setValue('subcategory', matchedSub.value as SubcategoryKey);
                    } else {
                      setValue('subcategory', 'custom');
                      setValue('customSubcategory', suggestion);
                    }
                  }
                  toast({ title: `Set category/subcategory based on: ${suggestion}` });
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
        {expenseToEdit ? t('addExpenseFormSaveButton').replace(t('addExpenseFormSaveButton').split(" ")[0], "Update") : t('addExpenseFormSaveButton')}
      </Button>
    </form>
  );
};

export default ExpenseForm;
