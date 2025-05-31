
export type Language = 'en' | 'ta' | 'hi';
export type Theme = 'light' | 'dark';

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
  theme: Theme;
}

export interface Translations {
  [key: string]: string | Translations;
}

export interface LocaleData {
  appName: string;
  navHome: string;
  navAddExpense: string;
  navSummary: string;
  navSettings: string;

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
  pickADatePlaceholder: string;
  addExpenseFormSelectedDateLabel: string;

  viewExpensesTitle: string;
  viewExpensesNoExpenses: string;

  monthlySummaryTitle: string;
  monthlyOverviewTitle: string;
  expenseBreakdownTitle: string;
  totalExpensesLabel: string;
  previousMonthAriaLabel: string;
  nextMonthAriaLabel: string;
  filterButtonLabel: string;
  exportButtonLabel: string;
  exportCsvButtonLabel: string;
  exportPdfButtonLabel: string;
  exportNoDataTitle: string;
  exportNoDataMessage: string;
  exportSuccessTitle: string;
  exportCsvSuccessMessage: string;
  exportPdfSuccessMessage: string;

  deleteConfirmationTitle: string;
  deleteConfirmationMessage: string;
  deleteConfirmationConfirmButton: string;
  deleteConfirmationCancelButton: string;

  settingsTitle: string;
  settingsLanguageLabel: string;
  settingsLanguageEnglish: string;
  settingsLanguageTamil: string;
  settingsLanguageHindi: string;
  settingsPreferencesTitle: string;
  settingsDarkModeLabel: string;
  settingsDataManagementTitle: string;
  settingsExportAllDataLabel: string;
  settingsExportAllDataCsvLabel: string;
  settingsExportAllDataPdfLabel: string;
  settingsExportAllSuccessTitle: string;
  settingsExportAllCsvSuccessMessage: string;
  settingsExportAllPdfSuccessMessage: string;
  settingsExportAllNoDataTitle: string;
  settingsExportAllNoDataMessage: string;
  settingsShareAppLabel: string;
  settingsShareAppMessage: string;
  settingsShareAppError: string;
  settingsClearAllDataLabel: string;
  settingsClearAllDataConfirmTitle: string;
  settingsClearAllDataConfirmMessage: string;
  settingsClearAllDataConfirmButton: string;
  settingsClearAllDataCancelButton: string;
  settingsClearAllDataSuccessToast: string;
  settingsSupportTitle: string;
  settingsHelpSupportLabel: string;
  settingsHelpSupportToast: string;

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
