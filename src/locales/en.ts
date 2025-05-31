
import type { Translations } from '@/types';

export const en: Translations = {
  appName: "Amma's Expense Pal",
  navHome: 'Home',
  navAddExpense: 'Add Expense',
  navSummary: 'Summary', // Changed from navViewExpenses
  navSettings: 'Settings',

  homeTitle: 'Monthly Summary', 
  homeTotalExpenses: 'Total Expenses This Month', 
  homeCategoryBreakdown: 'Category Breakdown', 
  homeAddExpenseButton: 'Add New Expense', 
  homeViewExpensesButton: 'View All Expenses',

  homeExpensesSummaryTitle: 'Expenses Summary',
  homeTodayLabel: 'Today',
  homeThisMonthLabel: 'This Month',
  homeQuickActionsTitle: 'Quick Actions',
  homeAddDailyExpenseButton: 'Add Daily Expense',
  homeAddCreditCardExpenseButton: 'Add Credit Card Expense',
  homeAddSpecialExpenseButton: 'Add Special Expense',
  homeRecentTransactionsTitle: 'Recent Transactions',
  homeNoRecentTransactionsMessage: 'No recent transactions yet.',

  addExpenseTitle: 'Add New Expense',
  addExpenseFormDateLabel: 'Date',
  addExpenseFormAmountLabel: 'Amount',
  addExpenseFormCategoryLabel: 'Category',
  addExpenseFormSubcategoryLabel: 'Subcategory',
  addExpenseFormCustomSubcategoryLabel: 'Custom Subcategory Name',
  addExpenseFormNotesLabel: 'Notes',
  addExpenseFormNotesPlaceholder: 'Enter any notes for this expense...',
  addExpenseFormSuggestCategoryButton: 'Suggest Category (AI)',
  addExpenseFormSaveButton: 'Save Expense',
  addExpenseSuccessToast: 'Expense added successfully!',
  customSubcategoryRequiredError: 'Custom subcategory name is required.',
  addExpenseFormSelectedDateLabel: 'Selected date: {{date}}',

  // Old ViewExpensesPage keys - some are repurposed for summary
  viewExpensesTitle: 'Monthly Summary', // Repurposed: Title for the summary page
  viewExpensesNoExpenses: 'No expenses recorded for this month.', // Repurposed for summary context

  // New keys for Monthly Summary
  monthlySummaryTitle: 'Monthly Summary',
  monthlyOverviewTitle: 'Monthly Overview',
  expenseBreakdownTitle: 'Expense Breakdown',
  totalExpensesLabel: 'Total Expenses',
  previousMonthAriaLabel: 'Go to previous month',
  nextMonthAriaLabel: 'Go to next month',
  filterButtonLabel: 'Filter',
  exportButtonLabel: 'Export',
  exportNoDataTitle: 'No Data',
  exportNoDataMessage: 'There is no data to export for the selected month.',
  exportSuccessTitle: 'Exported!',
  exportSuccessMessage: 'Monthly expenses exported to CSV.',


  deleteConfirmationTitle: 'Confirm Deletion',
  deleteConfirmationMessage: 'Are you sure you want to delete this expense? This action cannot be undone.',
  deleteConfirmationConfirmButton: 'Delete',
  deleteConfirmationCancelButton: 'Cancel',

  settingsTitle: 'Settings',
  settingsLanguageLabel: 'App Language',
  settingsLanguageEnglish: 'English',
  settingsLanguageTamil: 'Tamil (தமிழ்)',
  settingsLanguageHindi: 'Hindi (हिन्दी)',

  categoryDaily: '🍛 Daily',
  categoryCreditCard: '💳 Credit Card',
  categorySpecial: '🎁 Special',
  subcategoryGift: 'Gift',
  subcategoryMarriage: 'Marriage',
  subcategoryBirthday: 'Birthday',
  subcategoryCustom: 'Custom...',

  selectPlaceholder: 'Select an option',
  aiSuggestionsTitle: 'AI Category Suggestions',
  aiSuggestionError: 'Could not fetch AI suggestions.',
};
