import type { Expense } from '@/types';
import useLocalStorage from './use-local-storage';
import { v4 as uuidv4 } from 'uuid'; // Ensure uuid is installed: npm install uuid @types/uuid

const EXPENSES_KEY = 'amma-expense-pal-expenses';

export function useExpenses() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>(EXPENSES_KEY, []);

  const addExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
  };

  const updateExpense = (id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>) => {
    setExpenses(prevExpenses =>
      prevExpenses.map(expense =>
        expense.id === id ? { ...expense, ...updates } : expense
      )
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
  };

  const getExpenseById = (id: string): Expense | undefined => {
    return expenses.find(expense => expense.id === id);
  };

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpenseById,
    setExpenses // For bulk updates like sorting/filtering if managed outside
  };
}
