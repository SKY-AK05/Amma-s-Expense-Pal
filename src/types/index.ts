
export type Language = 'en' | 'ta' | 'hi';

export type CategoryKey = 'daily' | 'creditCard' | 'special';
export type SubcategoryKey = 'gift' | 'marriage' | 'birthday' | 'custom';

export interface Expense {
  id: string;
  date: string; // ISO string
  amount: number;
  category: CategoryKey;
  subcategory?: SubcategoryKey | string; // string for custom subcategory
  notes?: string;
  createdAt: string; // ISO string
}

export interface Settings {
  language: Language;
  // reminder_enabled: boolean; // Placeholder for future
  // backup_enabled: boolean; // Placeholder for future
}

export interface Translations {
  [key: string]: string | Translations;
}

export interface LocaleData {
  appName: string;
  navHome: string;
  navAddExpense: string;
  navViewExpenses: string; // Will be changed to navSummary
  navSettings: string;
  navSummary?: string; // New key for "Summary"

  homeTitle: string; 
  homeTotalExpenses: string; 
  homeCategoryBreakdown: string;
  homeAddExpenseButton: string; 
  homeViewExpensesButton: string;

  homeExpensesSummaryTitle: string;
  homeTodayLabel: string;
  homeThisMonthLabel: string;
  homeQuickActionsTitle: string;
  homeAddDailyExpenseButton: string;
  homeAddCreditCardExpenseButton: string;
  homeAddSpecialExpenseButton: string;
  homeRecentTransactionsTitle: string;
  homeNoRecentTransactionsMessage: string;

  addExpenseTitle: string;
  addExpenseFormDateLabel: string;
  addExpenseFormAmountLabel: string;
  addExpenseFormCategoryLabel: string;
  addExpenseFormSubcategoryLabel: string;
  addExpenseFormCustomSubcategoryLabel: string;
  addExpenseFormNotesLabel: string;
  addExpenseFormNotesPlaceholder: string;
  addExpenseFormSuggestCategoryButton: string;
  addExpenseFormSaveButton: string;
  addExpenseSuccessToast: string;
  customSubcategoryRequiredError: string;
  addExpenseFormSelectedDateLabel: string; 

  // Keys for old ViewExpensesPage - some might be reused or removed
  viewExpensesTitle: string; // Will be changed to monthlySummaryTitle
  viewExpensesTableDateHeader: string;
  viewExpensesTableAmountHeader: string;
  viewExpensesTableCategoryHeader: string;
  viewExpensesTableSubcategoryHeader: string;
  viewExpensesTableNotesHeader: string;
  viewExpensesTableActionsHeader: string;
  viewExpensesEditButton: string;
  viewExpensesDeleteButton: string;
  viewExpensesExportButton: string; // Will be changed to exportButtonLabel
  viewExpensesFilterByCategoryLabel: string;
  viewExpensesFilterAllCategories: string;
  viewExpensesSortByLabel: string;
  viewExpensesSortByDate: string;
  viewExpensesSortByAmount: string;
  viewExpensesSortAscending: string;
  viewExpensesSortDescending: string;
  viewExpensesNoExpenses: string;

  // New keys for Monthly Summary
  monthlySummaryTitle?: string;
  monthlyOverviewTitle?: string;
  expenseBreakdownTitle?: string;
  totalExpensesLabel?: string;
  previousMonthAriaLabel?: string;
  nextMonthAriaLabel?: string;
  filterButtonLabel?: string;
  exportButtonLabel?: string;
  exportNoDataTitle?: string;
  exportNoDataMessage?: string;
  exportSuccessTitle?: string;
  exportSuccessMessage?: string;


  deleteConfirmationTitle: string;
  deleteConfirmationMessage: string;
  deleteConfirmationConfirmButton: string;
  deleteConfirmationCancelButton: string;

  settingsTitle: string;
  settingsLanguageLabel: string;
  settingsLanguageEnglish: string;
  settingsLanguageTamil: string;
  settingsLanguageHindi: string;

  categoryDaily: string;
  categoryCreditCard: string;
  categorySpecial: string;
  subcategoryGift: string;
  subcategoryMarriage: string;
  subcategoryBirthday: string;
  subcategoryCustom: string;

  selectPlaceholder: string;
  aiSuggestionsTitle: string;
  aiSuggestionError: string;
}
