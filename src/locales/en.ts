
import type { Translations } from '@/types';

export const en: Translations = {
  appName: "Amma's Expense Pal",
  navHome: 'Home',
  navAddExpense: 'Add Expense',
  navViewExpenses: 'View Expenses',
  navSettings: 'Settings',

  homeTitle: 'Monthly Summary', // Old, can be repurposed or removed
  homeTotalExpenses: 'Total Expenses This Month', // Used for "This Month" in new summary
  homeCategoryBreakdown: 'Category Breakdown', // Old
  homeAddExpenseButton: 'Add New Expense', // Generic add button
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

  viewExpensesTitle: 'All Expenses',
  viewExpensesTableDateHeader: 'Date',
  viewExpensesTableAmountHeader: 'Amount',
  viewExpensesTableCategoryHeader: 'Category',
  viewExpensesTableSubcategoryHeader: 'Subcategory',
  viewExpensesTableNotesHeader: 'Notes',
  viewExpensesTableActionsHeader: 'Actions',
  viewExpensesEditButton: 'Edit',
  viewExpensesDeleteButton: 'Delete',
  viewExpensesExportButton: 'Export to CSV',
  viewExpensesFilterByCategoryLabel: 'Filter by Category',
  viewExpensesFilterAllCategories: 'All Categories',
  viewExpensesSortByLabel: 'Sort by',
  viewExpensesSortByDate: 'Date',
  viewExpensesSortByAmount: 'Amount',
  viewExpensesSortAscending: 'Ascending',
  viewExpensesSortDescending: 'Descending',
  viewExpensesNoExpenses: 'No expenses recorded yet.',

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
