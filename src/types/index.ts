
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
  navViewExpenses: string;
  navSettings: string;

  homeTitle: string; // Kept for potential future use, not directly in new design
  homeTotalExpenses: string; // Kept, now used for "This Month" in summary
  homeCategoryBreakdown: string;
  homeAddExpenseButton: string; // Kept, for generic add expense
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

  viewExpensesTitle: string;
  viewExpensesTableDateHeader: string;
  viewExpensesTableAmountHeader: string;
  viewExpensesTableCategoryHeader: string;
  viewExpensesTableSubcategoryHeader: string;
  viewExpensesTableNotesHeader: string;
  viewExpensesTableActionsHeader: string;
  viewExpensesEditButton: string;
  viewExpensesDeleteButton: string;
  viewExpensesExportButton: string;
  viewExpensesFilterByCategoryLabel: string;
  viewExpensesFilterAllCategories: string;
  viewExpensesSortByLabel: string;
  viewExpensesSortByDate: string;
  viewExpensesSortByAmount: string;
  viewExpensesSortAscending: string;
  viewExpensesSortDescending: string;
  viewExpensesNoExpenses: string;

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
